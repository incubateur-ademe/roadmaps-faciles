"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { useRef, useState } from "react";

import { POST_STATUS_COLOR, POST_STATUS_COLOR_MAP, type PostStatusColor } from "@/lib/model/PostStatus";

interface ColorSelectProps {
  label: string;
  value: PostStatusColor;
  onChange: (value: PostStatusColor) => void;
  disabled?: boolean;
}

const colors = Object.keys(POST_STATUS_COLOR) as Array<keyof typeof POST_STATUS_COLOR>;

export const ColorSelect = ({ label, value, onChange, disabled }: ColorSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (color: PostStatusColor) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className={fr.cx("fr-select-group")} ref={containerRef}>
      <label className={fr.cx("fr-label")}>{label}</label>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          className={fr.cx("fr-select")}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          style={{
            width: "100%",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <span className={`${fr.cx("fr-badge", "fr-badge--sm")} fr-badge--${POST_STATUS_COLOR_MAP[value]}`}>
            {value}
          </span>
        </button>
        {isOpen && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              }}
              onClick={() => setIsOpen(false)}
            />
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: "0.25rem",
                backgroundColor: "var(--background-default-grey)",
                border: "1px solid var(--border-default-grey)",
                borderRadius: "0.25rem",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 2,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSelect(color)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "none",
                    backgroundColor: value === color ? "var(--background-action-low-blue-france)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => {
                    if (value !== color) {
                      e.currentTarget.style.backgroundColor = "var(--background-default-grey-hover)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (value !== color) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span className={`${fr.cx("fr-badge", "fr-badge--sm")} fr-badge--${POST_STATUS_COLOR_MAP[color]}`}>
                    {color}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
