"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChangeEvent, ChangeEventHandler, useId, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Select, {
  AriaOnChangeProps,
  OnChangeValue,
  StylesConfig,
  components,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";

// const customSelectStyles: StylesConfig = {
//   control: (provided, state) => ({
//     // ...provided,
//     // background: "rgb(10, 10, 10)",
//     // border: "1px solid rgb(40, 40, 40)",
//     // display: "flex",
//     // borderRadius: "4px",
//     // padding: "0 4px",
//     // transition: "all",
//     // transitionDuration: "300ms",
//     // outline: state.isFocused
//     //   ? "1px solid rgb(100, 100, 100)"
//     //   : "1px solid transparent",
//     // cursor: "text",
//   }),
//   menu: (provided) => ({
//     // ...provided,
//     // position: "absolute",
//     // width: "100%",
//     // height: "auto",
//     // borderRadius: "4px",
//     // background: "rgb(10, 10, 10)",
//     // border: "1px solid rgb(35, 35, 35)",
//     // overflow: "hidden",
//     // animation: "fadeIn 0.1s linear",
//   }),
//   menuList: (provided) => ({
//     // ...provided,
//   }),
//   input: (provided) => ({
//     // ...provided,
//     // color: "rgb(230, 230, 230)",
//     // fontSize: "0.9rem",
//   }),
//   option: (provided, state) => ({
//     // height: "100%",
//     // padding: "8px 12px",
//     // cursor: "pointer",
//     // ":hover": {
//     //   background: "rgb(30, 30, 30)",
//     // },
//     // fontSize: "0.9rem",
//     // background: state.isSelected ? "rgb(30, 30, 30)" : "",
//     // transition: "all",
//     // transitionDuration: "300ms",
//   }),
//   placeholder: (provided) => ({
//     // ...provided,
//     // fontSize: "0.9rem",
//   }),
//   singleValue: (provided, state) => ({
//     // ...provided,
//     // fontSize: "0.9rem",
//     // color: "rgb(230, 230, 230)",
//   }),
//   indicatorSeparator: (provided) => ({
//     // ...provided,
//     // background: "rgb(60, 60, 60)",
//   }),
//   multiValueLabel: (provided, state) => ({
//     // ...provided,
//     // color: "black",
//   }),
// };

const selectOptions = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
  { value: "40", label: "40" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const animatedComponent = makeAnimated();

const DataTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [pageSizeOptions, setPageSizeOptions] = useState(selectOptions);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const generateArrayPageNumbers = (currentPageIndex: number) => {
    const pageCount = table.getPageCount();
    if (currentPageIndex === 1) {
      return [1, 2, 3];
    }

    if (currentPageIndex + 2 > pageCount) {
      return [pageCount - 2, pageCount - 1, pageCount];
    } else {
      return [currentPageIndex - 1, currentPageIndex, currentPageIndex + 1];
    }
  };

  const handleCreationPageSizeOptions = (inputValue: string) => {
    setPageSizeOptions((prev) => [
      ...prev,
      { value: inputValue, label: inputValue },
    ]);
  };

  return (
    <div className="max-w-[1000px] mx-auto py-10 flex flex-col gap-5">
      <div className="w-full flex justify-between">
        <Input
          type="text"
          placeholder="Búsqueda por correo..."
          className="bg-zinc-950 border border-zinc-800 text-zinc-100 max-w-[300px]"
          value={
            (table
              .getColumn("Correo Electrónico")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            table
              .getColumn("Correo Electrónico")
              ?.setFilterValue(e.currentTarget.value)
          }
        />

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto flex items-center justify-center gap-1 bg-transparent border border-zinc-800 hover:bg-zinc-800">
              Columns
              <ChevronDown strokeWidth={1.8} className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className=""
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      column.toggleVisibility(!!value);
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-white border border-zinc-800  rounded-md">
        <Table className="">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-zinc-900 hover:bg-zinc-900"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-zinc-400 font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-zinc-900 border-zinc-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-4 items-center justify-evenly px-6">
        <div className="text-zinc-400 w-full text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) selecccionadas
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-transparent flex items-center justify-center gap-1 h-10 text-white border-none"
              >
                <ChevronLeft strokeWidth={1.8} className="w-4 h-4" />
                Anterior
              </Button>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis
                className={`text-white ${
                  table.getCanPreviousPage() ? "opacity-100" : "opacity-0"
                } transition-all duration-300`}
              />
            </PaginationItem>

            {(table.getPageCount() === 0
              ? []
              : table.getPageCount() === 1
              ? [1]
              : table.getPageCount() === 2
              ? [1, 2]
              : generateArrayPageNumbers(
                  table.getState().pagination.pageIndex + 1
                )
            ).map((item) => (
              <PaginationItem key={item}>
                <Button
                  className={`border ${
                    item === table.getState().pagination.pageIndex + 1
                      ? "border-zinc-800 bg-zinc-800 transition-all duration-500"
                      : "border-transparent bg-transparent transition-none duration-0"
                  } w-10 hover:bg-zinc-800 select-none`}
                  onClick={() => {
                    table.setPageIndex(item - 1);
                  }}
                >
                  {item}
                </Button>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis
                className={`text-white ${
                  table.getCanNextPage() ? "opacity-100" : "opacity-0"
                } transition-all duration-300`}
              />
            </PaginationItem>

            <PaginationItem>
              <Button
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-transparent flex items-center justify-center gap-1 h-10 text-white border-none"
              >
                Siguiente
                <ChevronRight strokeWidth={1.8} className="w-4 h-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="text-white w-full">
          <CreatableSelect
            isMulti
            // defaultValue={[{ value: "5", label: "5" }]}
            placeholder="Filas por página..."
            className="react-select-container"
            classNamePrefix="react-select-child"
            // onChange={(e) => {
            //   const data = e as { value: string; label: string }[];
            //   table.setPageSize(parseInt(data[0].value));
            // }}
            // onMenuOpen={() => {
            //   customSelectStyles.singleValue = (provided, state) => ({
            //     ...provided,
            //     fontSize: "0.9rem",
            //     color: "rgb(120, 120, 120)",
            //     transition: "all",
            //     transitionDuration: "300ms",
            //   });
            // }}
            // onMenuClose={() => {
            //   customSelectStyles.singleValue = (provided, state) => ({
            //     ...provided,
            //     fontSize: "0.9rem",
            //     color: "rgb(230, 230, 230)",
            //     transition: "all",
            //     transitionDuration: "300ms",
            //   });
            // }}
            // onCreateOption={handleCreationPageSizeOptions}
            // components={{
            //   Input: ({ children, ...props }) => {
            //     return (
            //       <components.Input {...props}>{children}</components.Input>
            //     );
            //   },
            //   Option: ({ children, ...props }) => {
            //     const data = props.data as { value: string; label: string };
            //     if (
            //       parseInt(data.value) === table.getState().pagination.pageSize
            //     ) {
            //       props.isSelected = true;
            //     }
            //     return (
            //       <components.Option
            //         {...props}
            //         className="flex items-center gap-2"
            //       >
            //         <Check
            //           strokeWidth={1.8}
            //           className={`w-4 h-4 ${
            //             props.isSelected ? "opacity-100" : "opacity-0"
            //           }`}
            //         />
            //         {children}
            //       </components.Option>
            //     );
            //   },
            //   DropdownIndicator: ({ children, ...props }) => {
            //     return (
            //       <components.DropdownIndicator
            //         {...props}
            //         className="flex items-center justify-center"
            //       >
            //         <ChevronDown className={`w-4 h-4`} />
            //       </components.DropdownIndicator>
            //     );
            //   },
            //   SingleValue: ({ children, ...props }) => {
            //     return (
            //       <components.SingleValue {...props}>
            //         {children}
            //       </components.SingleValue>
            //     );
            //   },
            // }}
            instanceId={useId()}
            // styles={customSelectStyles}
            // classNames={{
            //   multiValue: () => "text-white flex",
            //   multiValueLabel: () => "text-white bg-zinc-200 dark:bg-zinc-800",
            //   control: () => "rounded-[400px] flex items-center border px-3",
            //   input: () => "flex w-full",
            //   container: () => "",
            //   placeholder: () => "absolute px-2",
            //   valueContainer: () => "",
            //   group: () => "",
            //   multiValueRemove: () => "bg-zinc-200",
            //   singleValue: () => "flex",
            // }}
            options={pageSizeOptions}
            menuPlacement="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default DataTable;
