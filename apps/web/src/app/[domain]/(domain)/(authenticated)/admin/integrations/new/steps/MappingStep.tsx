"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type Board, type PostStatus } from "@/prisma/client";

import { createBoard } from "../../../boards/actions";
import { createPostStatus } from "../../../statuses/actions";
import { useNotionWizardStore } from "../useNotionWizardStore";

interface MappingStepProps {
  boards: Board[];
  statuses: PostStatus[];
}

export const MappingStep = ({ boards, statuses }: MappingStepProps) => {
  const t = useTranslations("domainAdmin.integrations.wizard");
  const {
    schema,
    propertyMapping,
    statusMapping,
    boardMapping,
    syncDirection,
    additionalStatuses,
    additionalBoards,
    setPropertyMapping,
    setStatusMapping,
    setBoardMapping,
    setSyncDirection,
    addAdditionalStatus,
    addAdditionalBoard,
  } = useNotionWizardStore();

  // Build set of already-used property names for uniqueness constraints
  type MappingFieldKey =
    | "boardField"
    | "commentsField"
    | "dateField"
    | "descriptionField"
    | "likesField"
    | "statusField"
    | "tagsField"
    | "titleField";

  const usedProperties = useMemo(() => {
    const used = new Map<string, MappingFieldKey>(); // property name → field label key
    if (propertyMapping.title) {
      used.set(propertyMapping.title, "titleField");
    }
    if (
      propertyMapping.description &&
      typeof propertyMapping.description === "object" &&
      "name" in propertyMapping.description
    ) {
      used.set(propertyMapping.description.name, "descriptionField");
    }
    if (propertyMapping.date) {
      used.set(propertyMapping.date.name, "dateField");
    }
    if (propertyMapping.status) {
      used.set(propertyMapping.status.name, "statusField");
    }
    if (propertyMapping.tags) {
      used.set(propertyMapping.tags, "tagsField");
    }
    if (propertyMapping.commentsInfo) {
      used.set(propertyMapping.commentsInfo, "commentsField");
    }
    if (propertyMapping.likes) {
      const likesName = typeof propertyMapping.likes === "string" ? propertyMapping.likes : propertyMapping.likes.name;
      used.set(likesName, "likesField");
    }
    if (propertyMapping.board) {
      used.set(propertyMapping.board.name, "boardField");
    }
    return used;
  }, [propertyMapping]);

  const allStatuses = useMemo(
    () => [...statuses, ...additionalStatuses.map(s => ({ ...s }) as PostStatus)],
    [statuses, additionalStatuses],
  );

  const allBoards = useMemo(
    () => [...boards, ...additionalBoards.map(b => ({ ...b }) as Board)],
    [boards, additionalBoards],
  );

  // Clear outbound-only fields when switching to inbound mode
  useEffect(() => {
    if (syncDirection === "inbound") {
      const pm = useNotionWizardStore.getState().propertyMapping;
      if (pm.commentsInfo) setPropertyMapping("commentsInfo", undefined);
      if (pm.likes) setPropertyMapping("likes", undefined);
    }
  }, [syncDirection, setPropertyMapping]);

  // Auto-match Notion status options to existing PostStatus by name
  const lastAutoMatchedStatus = useRef<null | string>(null);
  useEffect(() => {
    const statusName = propertyMapping.status?.name;
    if (!statusName || !schema || lastAutoMatchedStatus.current === statusName) return;
    lastAutoMatchedStatus.current = statusName;

    const statusProp = schema.properties.find(p => p.name === statusName);
    if (!statusProp?.options) return;

    const currentMapping = useNotionWizardStore.getState().statusMapping;
    for (const opt of statusProp.options) {
      if (currentMapping[opt.id]) continue;
      const match = statuses.find(s => s.name.toLowerCase().trim() === opt.name.toLowerCase().trim());
      if (match) {
        setStatusMapping(opt.id, { localId: match.id, notionName: opt.name });
      }
    }
  }, [propertyMapping.status?.name, schema, statuses, setStatusMapping]);

  // Inline creation state
  const [creatingStatusForOptionId, setCreatingStatusForOptionId] = useState<null | string>(null);
  const [newStatusName, setNewStatusName] = useState("");
  const [creatingStatusLoading, setCreatingStatusLoading] = useState(false);

  const [creatingBoardForOptionId, setCreatingBoardForOptionId] = useState<null | string>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [creatingBoardLoading, setCreatingBoardLoading] = useState(false);

  const handleCreateStatus = useCallback(
    async (notionOptionId: string, notionOptionName: string) => {
      if (!newStatusName.trim()) return;
      setCreatingStatusLoading(true);
      const result = await createPostStatus({
        name: newStatusName.trim(),
        color: "grey",
        showInRoadmap: true,
      });
      setCreatingStatusLoading(false);
      if (result.ok) {
        addAdditionalStatus({ id: result.data.id, name: result.data.name });
        setStatusMapping(notionOptionId, { localId: result.data.id, notionName: notionOptionName });
        setCreatingStatusForOptionId(null);
        setNewStatusName("");
      }
    },
    [newStatusName, addAdditionalStatus, setStatusMapping],
  );

  const handleCreateBoard = useCallback(
    async (notionOptionId: string, notionOptionName: string) => {
      if (!newBoardName.trim()) return;
      setCreatingBoardLoading(true);
      const result = await createBoard({ name: newBoardName.trim() });
      setCreatingBoardLoading(false);
      if (result.ok) {
        addAdditionalBoard({ id: result.data.id, name: result.data.name });
        setBoardMapping(notionOptionId, { localId: result.data.id, notionName: notionOptionName });
        setCreatingBoardForOptionId(null);
        setNewBoardName("");
      }
    },
    [newBoardName, addAdditionalBoard, setBoardMapping],
  );

  if (!schema) {
    return <Alert severity="error" small description={t("noSchema")} />;
  }

  const richTextProps = schema.properties.filter(p => p.type === "rich_text");
  const selectProps = schema.properties.filter(p => p.type === "select" || p.type === "status");
  const multiSelectProps = schema.properties.filter(p => p.type === "multi_select");
  const numberProps = schema.properties.filter(p => p.type === "number");
  const dateProps = schema.properties.filter(p => p.type === "date" || p.type === "created_time");

  /** Check if a property name is used by another field (not the current one) */
  const isUsedBy = (propName: string, currentField: MappingFieldKey): false | MappingFieldKey =>
    usedProperties.has(propName) && usedProperties.get(propName) !== currentField
      ? usedProperties.get(propName)!
      : false;

  const showOutboundFields = syncDirection !== "inbound";

  return (
    <div>
      {/* Sync direction — moved here from ConfigStep so mapping fields adapt */}
      <Select
        label={t("syncDirection")}
        hint={t("syncDirectionHint")}
        nativeSelectProps={{
          value: syncDirection,
          onChange: e => setSyncDirection(e.target.value as typeof syncDirection),
        }}
      >
        <option value="bidirectional">{t("bidirectional")}</option>
        <option value="inbound">{t("inboundOnly")}</option>
        <option value="outbound">{t("outboundOnly")}</option>
      </Select>

      <p>{t("mappingDescription")}</p>

      <h4>{t("propertyMappings")}</h4>

      {/* Description mapping */}
      <Select
        label={t("descriptionField")}
        hint={t("descriptionFieldHint")}
        nativeSelectProps={{
          value: propertyMapping.description
            ? typeof propertyMapping.description === "object" && propertyMapping.description.type === "page_content"
              ? "__page_content__"
              : typeof propertyMapping.description === "object"
                ? propertyMapping.description.name
                : ""
            : "",
          onChange: e => {
            const val = e.target.value;
            if (val === "__page_content__") {
              setPropertyMapping("description", { type: "page_content" });
            } else if (val) {
              setPropertyMapping("description", { type: "property", name: val });
            } else {
              setPropertyMapping("description", undefined);
            }
          },
        }}
      >
        <option value="">{t("notMapped")}</option>
        <option value="__page_content__">{t("pageContent")}</option>
        {richTextProps.map(p => {
          const usedByField = isUsedBy(p.name, "descriptionField");
          return (
            <option key={p.id} value={p.name} disabled={!!usedByField}>
              {p.name}
              {usedByField ? ` (${t(usedByField)})` : ""}
            </option>
          );
        })}
      </Select>

      {/* Date mapping */}
      <Select
        label={t("dateField")}
        hint={t("dateFieldHint")}
        nativeSelectProps={{
          value: propertyMapping.date?.name ?? "",
          onChange: e => {
            const val = e.target.value;
            if (val) {
              const prop = dateProps.find(p => p.name === val);
              setPropertyMapping("date", {
                name: val,
                type: (prop?.type as "created_time" | "date") ?? "date",
              });
            } else {
              setPropertyMapping("date", undefined);
            }
          },
        }}
      >
        <option value="">{t("notMapped")}</option>
        {dateProps.map(p => {
          const usedByField = isUsedBy(p.name, "dateField");
          return (
            <option key={p.id} value={p.name} disabled={!!usedByField}>
              {p.name} ({p.type === "created_time" ? t("dateCreatedTime") : t("dateType")})
              {usedByField ? ` (${t(usedByField)})` : ""}
            </option>
          );
        })}
      </Select>

      {/* Status mapping */}
      <Select
        label={t("statusField")}
        nativeSelectProps={{
          value: propertyMapping.status?.name ?? "",
          onChange: e => {
            const val = e.target.value;
            if (val) {
              const prop = selectProps.find(p => p.name === val);
              setPropertyMapping("status", { name: val, type: (prop?.type as "select" | "status") ?? "select" });
            } else {
              setPropertyMapping("status", undefined);
            }
          },
        }}
      >
        <option value="">{t("notMapped")}</option>
        {selectProps.map(p => {
          const usedByField = isUsedBy(p.name, "statusField");
          return (
            <option key={p.id} value={p.name} disabled={!!usedByField}>
              {p.name} ({p.type}){usedByField ? ` (${t(usedByField)})` : ""}
            </option>
          );
        })}
      </Select>

      {/* Status value mapping */}
      {propertyMapping.status &&
        (() => {
          const statusProp = selectProps.find(p => p.name === propertyMapping.status?.name);
          if (!statusProp?.options) return null;
          return (
            <div className="fr-ml-4w fr-mb-3w">
              <h5>{t("statusValues")}</h5>
              {statusProp.options.map(opt => (
                <div key={opt.id}>
                  {creatingStatusForOptionId === opt.id ? (
                    <div className="fr-mb-2w">
                      <p className="fr-text--bold fr-mb-1w">{opt.name}</p>
                      <div className="flex items-end gap-2">
                        <Input
                          label={t("newStatusName")}
                          className="flex-1"
                          nativeInputProps={{
                            value: newStatusName,
                            onChange: e => setNewStatusName(e.target.value),
                            onKeyDown: e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                void handleCreateStatus(opt.id, opt.name);
                              }
                            },
                            autoFocus: true,
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => void handleCreateStatus(opt.id, opt.name)}
                          disabled={!newStatusName.trim() || creatingStatusLoading}
                        >
                          {creatingStatusLoading ? t("creating") : t("create")}
                        </Button>
                        <Button
                          size="small"
                          priority="tertiary"
                          onClick={() => {
                            setCreatingStatusForOptionId(null);
                            setNewStatusName("");
                          }}
                        >
                          {t("cancel")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Select
                          label={opt.name}
                          nativeSelectProps={{
                            value: statusMapping[opt.id]?.localId ?? "",
                            onChange: e => {
                              const localId = Number(e.target.value);
                              if (localId) {
                                setStatusMapping(opt.id, { localId, notionName: opt.name });
                              }
                            },
                          }}
                        >
                          <option value="">{t("notMapped")}</option>
                          {allStatuses.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <Button
                        size="small"
                        priority="tertiary"
                        iconId="ri-add-line"
                        className="fr-mb-3v"
                        onClick={() => {
                          setCreatingStatusForOptionId(opt.id);
                          setNewStatusName(opt.name);
                        }}
                      >
                        {t("createNew")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}

      {/* Tags mapping */}
      <Select
        label={t("tagsField")}
        nativeSelectProps={{
          value: propertyMapping.tags ?? "",
          onChange: e => setPropertyMapping("tags", e.target.value || undefined),
        }}
      >
        <option value="">{t("notMapped")}</option>
        {multiSelectProps.map(p => {
          const usedByField = isUsedBy(p.name, "tagsField");
          return (
            <option key={p.id} value={p.name} disabled={!!usedByField}>
              {p.name}
              {usedByField ? ` (${t(usedByField)})` : ""}
            </option>
          );
        })}
      </Select>

      {!showOutboundFields && (
        <Alert severity="info" small description={t("inboundHidesOutboundFields")} className="fr-mt-2w fr-mb-2w" />
      )}

      {/* Comments info field — hidden in inbound mode (outbound-only: pushes comment count to Notion) */}
      {showOutboundFields && (
        <Select
          label={t("commentsField")}
          hint={t("commentsFieldHint")}
          nativeSelectProps={{
            value: propertyMapping.commentsInfo ?? "",
            onChange: e => setPropertyMapping("commentsInfo", e.target.value || undefined),
          }}
        >
          <option value="">{t("notMapped")}</option>
          {richTextProps.map(p => {
            const usedByField = isUsedBy(p.name, "commentsField");
            return (
              <option key={p.id} value={p.name} disabled={!!usedByField}>
                {p.name}
                {usedByField ? ` (${t(usedByField)})` : ""}
              </option>
            );
          })}
        </Select>
      )}

      {/* Likes field — hidden in inbound mode (outbound-only: pushes vote count to Notion) */}
      {showOutboundFields && (
        <Select
          label={t("likesField")}
          nativeSelectProps={{
            value: propertyMapping.likes
              ? typeof propertyMapping.likes === "string"
                ? `${propertyMapping.likes}::number`
                : `${propertyMapping.likes.name}::${propertyMapping.likes.type}`
              : "",
            onChange: e => {
              const val = e.target.value;
              if (!val) {
                setPropertyMapping("likes", undefined);
              } else {
                const lastSep = val.lastIndexOf("::");
                const name = val.slice(0, lastSep);
                const type = val.slice(lastSep + 2) as "number" | "rich_text";
                setPropertyMapping("likes", { name, type });
              }
            },
          }}
        >
          <option value="">{t("notMapped")}</option>
          {numberProps.map(p => {
            const usedByField = isUsedBy(p.name, "likesField");
            return (
              <option key={p.id} value={`${p.name}::number`} disabled={!!usedByField}>
                {p.name}
                {usedByField ? ` (${t(usedByField)})` : ""}
              </option>
            );
          })}
          {richTextProps.map(p => {
            const usedByField = isUsedBy(p.name, "likesField");
            return (
              <option key={p.id} value={`${p.name}::rich_text`} disabled={!!usedByField}>
                {p.name} (texte){usedByField ? ` (${t(usedByField)})` : ""}
              </option>
            );
          })}
        </Select>
      )}

      <h4 className="fr-mt-4w">{t("boardMapping")}</h4>
      <p>{t("boardMappingDescription")}</p>

      {/* Board mapping — map select options to RF boards */}
      <Select
        label={t("boardField")}
        nativeSelectProps={{
          value: propertyMapping.board?.name ?? "",
          onChange: e => {
            const val = e.target.value;
            if (val) {
              const prop = selectProps.find(p => p.name === val);
              setPropertyMapping("board", { name: val, type: (prop?.type as "select" | "status") ?? "select" });
            } else {
              setPropertyMapping("board", undefined);
            }
          },
        }}
      >
        <option value="">{t("notMapped")}</option>
        {selectProps.map(p => {
          const usedByField = isUsedBy(p.name, "boardField");
          return (
            <option key={p.id} value={p.name} disabled={!!usedByField}>
              {p.name} ({p.type}){usedByField ? ` (${t(usedByField)})` : ""}
            </option>
          );
        })}
      </Select>

      {/* Board value mapping — from the selected board property */}
      {propertyMapping.board &&
        (() => {
          const boardProp = selectProps.find(p => p.name === propertyMapping.board?.name);
          if (!boardProp?.options) return null;
          return (
            <div className="fr-ml-4w fr-mb-3w">
              <h5>{t("boardValues")}</h5>
              {boardProp.options.map(opt => (
                <div key={opt.id}>
                  {creatingBoardForOptionId === opt.id ? (
                    <div className="fr-mb-2w">
                      <p className="fr-text--bold fr-mb-1w">{opt.name}</p>
                      <div className="flex items-end gap-2">
                        <Input
                          label={t("newBoardName")}
                          className="flex-1"
                          nativeInputProps={{
                            value: newBoardName,
                            onChange: e => setNewBoardName(e.target.value),
                            onKeyDown: e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                void handleCreateBoard(opt.id, opt.name);
                              }
                            },
                            autoFocus: true,
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => void handleCreateBoard(opt.id, opt.name)}
                          disabled={!newBoardName.trim() || creatingBoardLoading}
                        >
                          {creatingBoardLoading ? t("creating") : t("create")}
                        </Button>
                        <Button
                          size="small"
                          priority="tertiary"
                          onClick={() => {
                            setCreatingBoardForOptionId(null);
                            setNewBoardName("");
                          }}
                        >
                          {t("cancel")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Select
                          label={opt.name}
                          nativeSelectProps={{
                            value: boardMapping[opt.id]?.localId ?? "",
                            onChange: e => {
                              const localId = Number(e.target.value);
                              if (localId) {
                                setBoardMapping(opt.id, { localId, notionName: opt.name });
                              }
                            },
                          }}
                        >
                          <option value="">{t("notMapped")}</option>
                          {allBoards.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <Button
                        size="small"
                        priority="tertiary"
                        iconId="ri-add-line"
                        className="fr-mb-3v"
                        onClick={() => {
                          setCreatingBoardForOptionId(opt.id);
                          setNewBoardName(opt.name);
                        }}
                      >
                        {t("createNew")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}

      {/* No board mapping info */}
      {!propertyMapping.board && (
        <Alert severity="info" small description={t("defaultBoardInfo")} className="fr-mt-2w" />
      )}
    </div>
  );
};
