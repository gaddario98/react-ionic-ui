import React, { ComponentProps, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  TableOptions,
  Row,
  Cell,
  Header,
  PaginationState,
  getExpandedRowModel,
  getGroupedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { typography, useThemeValue } from "../../styles";
import { Text } from "../text";
import { IonItem } from "@ionic/react";
import { CustomIonItem } from "../item";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { Button } from "../button";

export type TableFooterCell = {
  element: React.ReactNode;
  className?: string;
  colSpan?: number;
};

export type TableProps<T> = {
  loading?: boolean;
  pageCount?: number;
  pageIndex?: number;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: (row: Row<T>) => string;
  tdClassName?: (cell: Cell<T, unknown>) => string;
  thClassName?: (header: Header<T, unknown>) => string;
  renderPagination?: boolean;
  title?: ComponentProps<typeof Text>;
} & Omit<TableOptions<T>, "getCoreRowModel">;

export function Table<T>({
  data,
  columns,
  loading,
  pageCount,
  tableClassName = "min-w-full border-collapse",
  theadClassName = "",
  tbodyClassName = "",
  trClassName = () => "",
  tdClassName = () => "",
  thClassName = () => "",
  renderPagination,
  title,
  state = {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    expanded: {},
    grouping: [],
    sorting: [],
  },
  ...props
}: TableProps<T>) {
  const theme = useThemeValue();
  const { pagination: customPagination, ...customState } = state;

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    ...customPagination,
  });

  const tableBg = useMemo(
    () => (theme.theme === "dark" ? "" : "bg-white"),
    [theme.theme]
  );
  const hoverRowBg = useMemo(
    () =>
      theme.theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-primary-100",
    [theme.theme]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), enableSorting: true,
    pageCount,
    state: {
      pagination,
      ...customState,
    },
    ...props,
  });

  if (loading && !data?.length) {
    return <div>Loading...</div>;
  }

  if (!data?.length) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {title && (
        <IonItem lines="full" className="rounded-t-md">
          <Text
            {...title}
            contentClassName={`${typography.text.input} ${title?.contentClassName ?? ""}`}
          />
        </IonItem>
      )}
      <div className="w-full overflow-x-auto">
        <table
          className={`min-w-full border-collapse ${tableBg} ${tableClassName}`}
        >
          <thead className={`${theadClassName} sticky top-0 z-10`}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`${typography.text.input} ${theme.theme === "dark" ? "border-zinc-700 bg-zinc-800 text-white" : "border-gray-200 bg-gray-50 text-gray-700"} font-semibold border-b !p-3 text-left align-middle whitespace-nowrap ${thClassName(header)} ${header.column.getCanSort() ? "cursor-pointer" : ""
                      }`}
                    onClick={header.column.getToggleSortingHandler()}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={tbodyClassName}>
            {table.getRowModel().rows.map((row) => {
              /* if (row.getIsGrouped()) {
                // Render header di gruppo
              return (
                  <tr key={row.id} className="bg-primary-50 dark:bg-zinc-800">
                    <td
                      colSpan={row.getVisibleCells().length}
                      className="font-bold !p-3"
                    >
                      <span
                        className="mr-2 cursor-pointer"
                        onClick={row.getToggleExpandedHandler()}
                        style={{ userSelect: "none" }}
                      >
                        {row.getIsExpanded() ? "▼" : "▶"}
                      </span>
                      {row
                        .getGroupingValue(row.groupingColumnId as string)
                        ?.toString()}
                      {` (${row.subRows.length})`}
                    </td>
                  </tr>
                );
              }*/
              return (
                <React.Fragment key={row.id}>
                  <tr
                    className={`transition ${hoverRowBg} hover:shadow-sm ${trClassName(row)}`}
                    onClick={
                      row.getCanExpand()
                        ? row.getToggleExpandedHandler()
                        : undefined
                    }
                    style={
                      row.getCanExpand() ? { cursor: "pointer" } : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <td
                        key={cell.id}
                        className={`${typography.text.input} ${theme.theme === "dark" ? "border-zinc-700" : "border-gray-200"} border-b !p-3 align-middle whitespace-nowrap ${tdClassName(cell)}`}
                      >
                        {(
                          cell.getIsGrouped()) && (
                            <span className="mr-2 cursor-pointer">
                              {row.getIsExpanded() ? "▼" : "▶"}
                            </span>
                          )}

                        {cell.getIsGrouped()
                          ? flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                          : cell.getIsAggregated()
                            ? flexRender(
                              cell.column.columnDef.aggregatedCell ??
                              cell.column.columnDef.cell ?? 'gv',
                              cell.getContext()
                            )
                            : cell.getIsPlaceholder()
                              ? null
                              : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
          {table.getFooterGroups().length > 0 && (
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`${typography.text.input} ${theme.theme === "dark" ? "border-zinc-700 bg-zinc-800 text-white" : "border-gray-200 bg-gray-50 text-gray-700"} font-semibold border-b !p-3 text-left align-middle whitespace-nowrap ${thClassName(header)}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
      {renderPagination && (
        <CustomIonItem>
          <Button
            iconOnly
            startIcon={{
              name: chevronBackOutline,
              className: `cursor-pointer ${typography.icon.title} ${!table.getCanPreviousPage() ? "text-medium-tint" : "text-medium"}`,
            }}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            variant="text"
            color={'light' === theme.theme ? 'medium' : theme.theme}
          />
          <div className="text-medium font-medium text-center w-full">
            Pagina {table.getState().pagination.pageIndex + 1} /
            {table.getPageCount()}
          </div>

          <Button
            iconOnly
            startIcon={{
              name: chevronForwardOutline,
              className: `cursor-pointer ${typography.icon.title} ${!table.getCanNextPage() ? "text-medium-tint" : "text-medium"}`,
            }}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="text"
            color={'light' === theme.theme ? 'medium' : theme.theme}
          />
        </CustomIonItem>
      )}
    </div>
  );
}

export default Table;
