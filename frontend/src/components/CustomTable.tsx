import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";

// Tailwind class presets per variant
const TableVariant = {
  Question: {
    table: "min-w-full",
    header: "bg-transparent ",
    headerrow: "bg-transparent ",
    headercell:
      "py-3 px-4 text-left text-xs font-bold text-white uppercase tracking-wider",
    tableBody: "bg-transparent ",
    row: "",
    cell: "px-4 py-3 text-lg font-outfit text-white leading-[100%] font-medium",
  },
  TeamA: {
    table: "min-w-full text-sm text-left text-red-700",
    header: "border-b border-red-400",
    headerrow: "",
    headercell: "py-2 px-4 text-left text-xs font-bold uppercase tracking-wide",
    tableBody: "",
    row: "border-b border-opacity-30",
    cell: "py-2 px-4 text-sm",
  },
  TeamB: {
    table: "min-w-full text-sm text-left text-orange-700",
    header: "border-b border-orange-400",
    headerrow: "",
    headercell: "py-2 px-4 text-left text-xs font-bold uppercase tracking-wide",
    tableBody: "",
    row: "border-b border-opacity-30",
    cell: "py-2 px-4 text-sm",
  },
  SoloGameEnd: {
    table: "w-full text-sm",
    header: "",
    headerrow: "",
    headercell:
      "px-4 py-3 text-center text-orange-500 font-semibold bg-gradient-to-r from-amber-100 to-orange-100",
    tableBody: "",
    row: "text-gray-700 font-medium",
    cell: "px-4 py-3 text-center border-t border-orange-100",
  },
  // You can add other variants like "SoloBoard", "TeamA", etc. here later.
} as const;
type Variant = keyof typeof TableVariant;
type Column<T> = {
  name: string;
  cell: (row: T, idx?: number, allRows?: T[]) => React.ReactNode;
};
type Props<T> = {
  columns: Column<T>[];
  data: T[];
  variant?: Variant;
};
const CustomTable = <T,>({ columns, data, variant = "Question" }: Props<T>) => {
  const styles = TableVariant[variant];

  return (
    <Table className={styles.table}>
      <TableHeader className={styles.header}>
        <TableRow className={cn(styles.headerrow, "gradientRow")}>
          {columns.map((column, idx) => (
            <TableHead key={idx} className={styles.headercell}>
              {column.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody className={styles.tableBody}>
        {data.length === 0 ? (
          <TableRow className="gradientRow">
            <TableCell
              colSpan={columns.length}
              className="text-muted-foreground py-4 text-center text-sm"
            >
              No data available.
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className={cn(styles.row, "gradientRow")}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex} className={styles.cell}>
                  {col.cell(row, rowIndex, data)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
