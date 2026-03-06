"use client";

import { cn } from "@kokatsuna/ui";
import { Badge } from "@kokatsuna/ui/components/badge";
import { Label } from "@kokatsuna/ui/components/label";
import { useRef, useState } from "react";

import { POST_STATUS_COLOR, POST_STATUS_COLOR_MAP, type PostStatusColor } from "@/lib/model/PostStatus";

interface ColorSelectProps {
  disabled?: boolean;
  label: string;
  onChange: (value: PostStatusColor) => void;
  value: PostStatusColor;
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
    <div className="space-y-2" ref={containerRef}>
      <Label>{label}</Label>
      <div className="relative">
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs text-left",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={`fr-badge fr-badge--sm fr-badge--${POST_STATUS_COLOR_MAP[value]}`}>{value}</span>
        </button>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md max-h-[300px] overflow-y-auto z-20 shadow-md">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSelect(color)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                    value === color ? "bg-accent" : "hover:bg-accent/50",
                  )}
                >
                  <Badge variant="outline">{color}</Badge>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
