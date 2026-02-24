"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Select from "@codegouvfr/react-dsfr/Select";
import { useTranslations } from "next-intl";

import { type Board, type PostStatus } from "@/prisma/client";

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
    setPropertyMapping,
    setStatusMapping,
    setBoardMapping,
  } = useNotionWizardStore();

  if (!schema) {
    return <Alert severity="error" small description={t("noSchema")} />;
  }

  const richTextProps = schema.properties.filter(p => p.type === "rich_text");
  const selectProps = schema.properties.filter(p => p.type === "select" || p.type === "status");
  const multiSelectProps = schema.properties.filter(p => p.type === "multi_select");
  const numberProps = schema.properties.filter(p => p.type === "number");

  return (
    <div>
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
        {richTextProps.map(p => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </Select>

      {/* Status mapping */}
      <Select
        label={t("statusField")}
        nativeSelectProps={{
          value: propertyMapping.status ?? "",
          onChange: e => setPropertyMapping("status", e.target.value || undefined),
        }}
      >
        <option value="">{t("notMapped")}</option>
        {selectProps.map(p => (
          <option key={p.id} value={p.name}>
            {p.name} ({p.type})
          </option>
        ))}
      </Select>

      {/* Status value mapping */}
      {propertyMapping.status &&
        (() => {
          const statusProp = selectProps.find(p => p.name === propertyMapping.status);
          if (!statusProp?.options) return null;
          return (
            <div className="fr-ml-4w fr-mb-3w">
              <h5>{t("statusValues")}</h5>
              {statusProp.options.map(opt => (
                <Select
                  key={opt.id}
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
                  {statuses.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
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
        {multiSelectProps.map(p => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </Select>

      {/* Comments info field */}
      <Select
        label={t("commentsField")}
        hint={t("commentsFieldHint")}
        nativeSelectProps={{
          value: propertyMapping.commentsInfo ?? "",
          onChange: e => setPropertyMapping("commentsInfo", e.target.value || undefined),
        }}
      >
        <option value="">{t("notMapped")}</option>
        {richTextProps.map(p => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </Select>

      {/* Likes field */}
      <Select
        label={t("likesField")}
        nativeSelectProps={{
          value: propertyMapping.likes ?? "",
          onChange: e => setPropertyMapping("likes", e.target.value || undefined),
        }}
      >
        <option value="">{t("notMapped")}</option>
        {numberProps.map(p => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
        {richTextProps.map(p => (
          <option key={p.id} value={p.name}>
            {p.name} (texte)
          </option>
        ))}
      </Select>

      <h4 className="fr-mt-4w">{t("boardMapping")}</h4>
      <p>{t("boardMappingDescription")}</p>

      {/* Board mapping — map select options to RF boards */}
      <Select
        label={t("boardField")}
        nativeSelectProps={{
          onChange: e => {
            const propName = e.target.value;
            // Store the property name for board mapping reference
            if (propName) {
              // Reset board mapping when property changes
            }
          },
        }}
      >
        <option value="">{t("notMapped")}</option>
        {selectProps.map(p => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </Select>

      {/* Board value mapping would go here — similar to status value mapping */}
      {boards.length > 0 && selectProps.length > 0 && selectProps[0]?.options && (
        <div className="fr-ml-4w fr-mb-3w">
          <h5>{t("boardValues")}</h5>
          {selectProps[0].options.map(opt => (
            <Select
              key={opt.id}
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
              {boards.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          ))}
        </div>
      )}
    </div>
  );
};
