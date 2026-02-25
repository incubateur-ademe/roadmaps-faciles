"use client";

import { fr } from "@codegouvfr/react-dsfr";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useTranslations } from "next-intl";
import { search } from "node-emoji";
import { Fragment, type DragEvent, type KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { MarkdownHooks } from "react-markdown";

import { reactMarkdownPreviewConfig } from "@/utils/react-markdown";

import { Text } from "../Typography";
import styles from "./MarkdownEditor.module.scss";
import { applyToolbarAction, insertImageMarkdown, toolbarItems } from "./markdownToolbar";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "text-expander": React.DetailedHTMLProps<{ keys?: string } & React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const ALLOWED_TYPES = new Set(["image/gif", "image/jpeg", "image/png", "image/webp"]);

export interface MarkdownEditorProps {
  defaultValue?: string;
  disabled?: boolean;
  hintText?: string;
  label?: string;
  onChangeAction?: (value: string) => void;
  uploadImageAction?: (formData: FormData) => Promise<{ data?: { url: string }; error?: string; ok: boolean }>;
}

export const MarkdownEditor = ({
  label,
  hintText,
  defaultValue = "",
  disabled = false,
  onChangeAction,
  uploadImageAction,
}: MarkdownEditorProps) => {
  const t = useTranslations("editor");
  const [value, setValue] = useState(defaultValue);
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<null | string>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [expanderEl, setExpanderEl] = useState<HTMLElement | null>(null);
  const expanderCallbackRef = useCallback((node: HTMLElement | null) => setExpanderEl(node), []);
  const inputId = useId();

  // Load text-expander Web Component client-side only (uses HTMLElement at module scope)
  useEffect(() => {
    void import("@github/text-expander-element");
  }, []);

  useEffect(() => {
    if (!uploadError) return;
    const timer = setTimeout(() => setUploadError(null), 5000);
    return () => clearTimeout(timer);
  }, [uploadError]);

  const updateValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      onChangeAction?.(newValue);
    },
    [onChangeAction],
  );

  // Emoji autocomplete via text-expander
  useEffect(() => {
    if (!expanderEl) return;
    const expander = expanderEl;

    const MAX_SUGGESTIONS = 8;

    const handleChange = (e: Event) => {
      const { text, provide } = (e as CustomEvent).detail as {
        provide: (result: { fragment?: HTMLElement; matched: boolean }) => void;
        text: string;
      };

      let results: ReturnType<typeof search> = [];
      try {
        results = search(text).slice(0, MAX_SUGGESTIONS);
      } catch {
        // node-emoji passes query to RegExp — special chars like +, *, ( crash it
        provide({ matched: false });
        return;
      }
      if (results.length === 0) {
        provide({ matched: false });
        return;
      }

      const menu = document.createElement("ul");
      menu.className = styles.emojiMenu;
      menu.setAttribute("role", "listbox");

      for (const result of results) {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.setAttribute("data-value", `:${result.name}:`);
        const charSpan = document.createElement("span");
        charSpan.className = styles.emojiChar;
        charSpan.textContent = result.emoji;
        const nameSpan = document.createElement("span");
        nameSpan.className = styles.emojiName;
        nameSpan.textContent = `:${result.name}:`;
        li.append(charSpan, " ", nameSpan);
        menu.appendChild(li);
      }

      provide({ matched: true, fragment: menu });
    };

    const handleValue = (e: Event) => {
      const detail = (e as CustomEvent).detail as { item: HTMLElement; value: null | string };
      detail.value = detail.item.getAttribute("data-value");
    };

    const handleCommitted = (e: Event) => {
      const detail = (e as CustomEvent).detail as { input: HTMLTextAreaElement };
      updateValue(detail.input.value);
    };

    expander.addEventListener("text-expander-change", handleChange);
    expander.addEventListener("text-expander-value", handleValue);
    expander.addEventListener("text-expander-committed", handleCommitted);

    return () => {
      expander.removeEventListener("text-expander-change", handleChange);
      expander.removeEventListener("text-expander-value", handleValue);
      expander.removeEventListener("text-expander-committed", handleCommitted);
    };
  }, [expanderEl, updateValue]);

  const applyAction = useCallback(
    (action: (typeof toolbarItems)[number]["action"]) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { newValue, cursorStart, cursorEnd } = applyToolbarAction(textarea, action);
      updateValue(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorStart, cursorEnd);
      });
    },
    [updateValue],
  );

  const handleUpload = useCallback(
    async (file: File) => {
      if (!uploadImageAction) return;
      if (!ALLOWED_TYPES.has(file.type)) return;

      setUploading(true);
      setUploadError(null);
      try {
        const formData = new FormData();
        formData.set("file", file);
        const result = await uploadImageAction(formData);

        if (result.ok && result.data) {
          const textarea = textareaRef.current;
          if (!textarea) return;

          const { newValue, cursorStart, cursorEnd } = insertImageMarkdown(
            textarea,
            result.data.url,
            file.name.replace(/\.[^.]+$/, ""),
          );
          updateValue(newValue);

          requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(cursorStart, cursorEnd);
          });
        } else if (result.error) {
          setUploadError(result.error);
        }
      } catch {
        setUploadError(t("uploadFailed"));
      } finally {
        setUploading(false);
      }
    },
    [t, uploadImageAction, updateValue],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!e.ctrlKey && !e.metaKey) return;
      const item = toolbarItems.find(i => i.shortcut?.key === e.key.toLowerCase());
      if (item) {
        e.preventDefault();
        applyAction(item.action);
      }
    },
    [applyAction],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (disabled) return;
      const items = e.clipboardData.items;
      for (const item of items) {
        if (ALLOWED_TYPES.has(item.type)) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) void handleUpload(file);
          return;
        }
      }
    },
    [disabled, handleUpload],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (ALLOWED_TYPES.has(file.type)) {
          void handleUpload(file);
        }
      }
    },
    [disabled, handleUpload],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div>
      {Boolean(label) && (
        <label className={fr.cx("fr-label")} htmlFor={inputId}>
          {label}
          {hintText !== undefined && <span className="fr-hint-text">{hintText}</span>}
        </label>
      )}
      <div className={styles.editor}>
        <div className={styles.toolbar}>
          {toolbarItems.map((item, index) => (
            <Fragment key={item.label}>
              {(index === 2 || index === 5) && <span className={styles.separator} />}
              <button
                type="button"
                className={styles.toolbarButton}
                title={t(item.label as Parameters<typeof t>[0])}
                disabled={disabled || previewEnabled}
                onClick={() => applyAction(item.action)}
              >
                <span className={cx(fr.cx(item.icon as Parameters<typeof fr.cx>[0]), "fr-icon--sm")} aria-hidden />
              </button>
            </Fragment>
          ))}

          {uploadImageAction && (
            <>
              <span className={styles.separator} />
              <button
                type="button"
                className={styles.toolbarButton}
                title={t("image")}
                disabled={disabled || previewEnabled || uploading}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/png,image/jpeg,image/gif,image/webp";
                  input.onchange = () => {
                    const file = input.files?.[0];
                    if (file) void handleUpload(file);
                  };
                  input.click();
                }}
              >
                <span className={cx(fr.cx("fr-icon-image-line"), "fr-icon--sm")} aria-hidden />
              </button>
            </>
          )}

          <div className="ml-auto flex items-center">
            {uploading && <span className={styles.uploading}>{t("uploading")}</span>}
            {uploadError && <span className={styles.uploadError}>{uploadError}</span>}
            <ToggleSwitch
              className="mb-0"
              label={
                <Text inline variant="sm" className="mr-[-1.5rem]">
                  {t("preview")}
                </Text>
              }
              inputTitle={t("preview")}
              labelPosition="left"
              checked={previewEnabled}
              onChange={() => setPreviewEnabled(!previewEnabled)}
            />
          </div>
        </div>

        {previewEnabled ? (
          <div className={styles.preview}>
            {value ? (
              <MarkdownHooks {...reactMarkdownPreviewConfig}>{value}</MarkdownHooks>
            ) : (
              <Text className={fr.cx("fr-text--light")}>{t("previewEmpty")}</Text>
            )}
          </div>
        ) : (
          <text-expander ref={expanderCallbackRef} keys=":">
            <textarea
              ref={textareaRef}
              id={inputId}
              className={cx(styles.textarea, isDragging && styles.dropzone)}
              value={value}
              disabled={disabled}
              placeholder={t("placeholder")}
              onChange={e => updateValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            />
          </text-expander>
        )}
      </div>
    </div>
  );
};
