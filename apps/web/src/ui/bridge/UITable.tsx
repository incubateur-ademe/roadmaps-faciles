"use client";

import { cn, Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@kokatsuna/ui";

import { useUI } from "@/ui";

export type UITableHeader = Array<{
  children: React.ReactNode;
  className?: string;
}>;

export type UITableRow = Array<{
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}>;

export type UITableProps = {
  body: UITableRow[];
  className?: string;
  header: UITableHeader;
};

export const UITable = ({ header, body, className }: UITableProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    // Dynamically import TableCustom to avoid bundling DSFR in Default-only contexts
    // For now, render the same shadcn table — callers in DSFR zones should use
    // TableCustom directly. This bridge is mainly for shared admin components.
    // Falls through to Default rendering.
  }

  return (
    <ShadcnTable className={className}>
      <TableHeader>
        <TableRow>
          {header.map((cell, i) => (
            <TableHead key={i} className={cell.className}>
              {cell.children}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {body.map((row, rowIdx) => (
          <TableRow key={rowIdx}>
            {row.map((cell, cellIdx) => (
              <TableCell key={cellIdx} className={cn(cell.className)} colSpan={cell.colSpan}>
                {cell.children}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </ShadcnTable>
  );
};
