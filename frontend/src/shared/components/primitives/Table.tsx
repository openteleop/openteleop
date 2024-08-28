import * as React from "react";
import { cn } from "@shared/helpers/tailwind";
import Select from "./Select";
import Button from "./Button";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";

const TableSectionContext = React.createContext("body");

const TableRoot = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className={cn("scrollbar-hide relative flex min-h-0 w-full min-w-0 overflow-auto", className)}>
    <table ref={ref} className="w-full caption-bottom text-2" {...props} />
  </div>
));
TableRoot.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <TableSectionContext.Provider value="header">
      <thead
        ref={ref}
        className={cn(
          // ring here is a hack to avoid scrolling rows from showing in the gap between the row and it's outline on the bottom edge
          "sticky top-0 z-10 border-b bg-panel outline outline-1 outline-gray-6 ring-1 ring-panel-solid [&_tr]:border-b",
          className,
        )}
        {...props}
      />
    </TableSectionContext.Provider>
  ),
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <TableSectionContext.Provider value="body">
      <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
    </TableSectionContext.Provider>
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <TableSectionContext.Provider value="footer">
      <tfoot ref={ref} className={cn("border-t border-gray-6 bg-gray-2 font-medium [&>tr]:last:border-b-0 ", className)} {...props} />
    </TableSectionContext.Provider>
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => {
  const section = React.useContext(TableSectionContext);
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-gray-3",
        section === "body" ? "transition-colors hover:bg-gray-2 data-[state=selected]:bg-gray-3" : "",
        section === "header" ? "border-gray-6" : "",
        className,
      )}
      {...props}
    />
  );
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-rx-8 whitespace-nowrap px-rx-4 text-left align-middle font-bold text-gray-9 [&:has([role=checkbox])]:pr-0 ",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("px-rx-4 py-3 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn("mt-4 text-2 text-gray-11", className)} {...props} />,
);
TableCaption.displayName = "TableCaption";

interface TableNoDataProps extends React.HTMLAttributes<HTMLTableRowElement> {
  message?: string;
}
const TableNoData = React.forwardRef<HTMLTableRowElement, TableNoDataProps>(({ className, message, ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <tr ref={ref} className={cn("text-center", className)} {...props}>
      <td colSpan={5} className="py-rx-4 italic text-gray-8">
        {message ?? t("error.noResultsFound")}
      </td>
    </tr>
  );
});
TableNoData.displayName = "TableNoData";

interface TablePaginationProps {
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const TablePagination = ({ total, page, rowsPerPage, onPageChange, onRowsPerPageChange }: TablePaginationProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full items-center justify-between py-rx-3 pl-rx-2 text-2 text-gray-11">
      <span>{t("shared.totalRows", { total })}</span>
      <div className="flex items-center gap-rx-4">
        <div className="flex items-center gap-rx-2">
          <span>{t("shared.rowsPerPage")}:</span>
          <Select value={String(rowsPerPage)} onValueChange={(value) => onRowsPerPageChange(Number(value))}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="10">10</Select.Item>
              <Select.Item value="25">25</Select.Item>
              <Select.Item value="50">50</Select.Item>
              <Select.Item value="100">100</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div className="flex items-center gap-rx-2">
          <span>{t("shared.pageXOfY", { page: page + 1, total: Math.ceil(total / rowsPerPage) })}</span>
          <Button size="icon" variant="outline" onClick={() => onPageChange(page - 1)} disabled={page === 0}>
            <Icon icon="chevron-left" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(page + 1)}
            disabled={page === Math.ceil(total / rowsPerPage) - 1}
          >
            <Icon icon="chevron-right" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  NoData: TableNoData,
  Pagination: TablePagination,
});

export default Table;
