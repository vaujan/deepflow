"use client";

import React, { useState, useMemo } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	ColumnDef,
	flexRender,
	SortingState,
	FilterFn,
	ColumnFiltersState,
	VisibilityState,
} from "@tanstack/react-table";
import {
	Search,
	Filter,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Eye,
	EyeOff,
	Clock,
	Play,
	TimerReset,
	Timer,
} from "lucide-react";

// Session row type - represents a single deep work session
// Planned session: user sets duration beforehand
// Open session: flow-based, ends naturally when done
export type DataItem = {
	id: string;
	goal: string;
	sessionType: "planned session" | "open session";
	duration: number; // in minutes
	focusLevel: number | null; // 1-10 or null if not set
	quality: number; // 1-10
	notes: string;
	tags: string[]; // optional tags for categorization
	sessionDate: string; // when the session was taken
	// Legacy fields to avoid breaking other components; optional
	name?: string;
	status?: "active" | "inactive" | "pending";
	category?: string;
	priority?: "low" | "medium" | "high";
	createdAt?: string;
};

// Sample data
const sampleData: DataItem[] = [
	{
		id: "1",
		goal: "Complete API integration",
		sessionType: "planned session",
		duration: 150,
		focusLevel: 8,
		quality: 9,
		notes:
			"Had some interruptions but managed to complete the core functionality",
		tags: ["coding", "api", "backend"],
		sessionDate: "2024-01-15",
	},
	{
		id: "2",
		goal: "Draft blog post outline",
		sessionType: "open session",
		duration: 105,
		focusLevel: null,
		quality: 8,
		notes: "Good flow; outline is comprehensive",
		tags: ["writing", "content"],
		sessionDate: "2024-01-14",
	},
	{
		id: "3",
		goal: "Redesign landing page",
		sessionType: "planned session",
		duration: 195,
		focusLevel: 9,
		quality: 10,
		notes: "Excellent focus; design came together",
		tags: ["design", "ui", "frontend"],
		sessionDate: "2024-01-13",
	},
];

// Custom filter function for duration
const durationFilter: FilterFn<DataItem> = (row, columnId, filterValue) => {
	const duration = row.getValue(columnId) as number;
	const [min, max] = filterValue as [number, number];
	return duration >= min && duration <= max;
};

// Global filter function
const globalFilter = (row: any, columnId: any, filterValue: any) => {
	const searchValue = filterValue.toLowerCase();
	const cellValue = row.getValue(columnId);

	if (typeof cellValue === "string") {
		return cellValue.toLowerCase().includes(searchValue);
	}

	if (typeof cellValue === "number") {
		return cellValue.toString().includes(searchValue);
	}

	return false;
};

interface DataTableProps {
	data?: DataItem[];
}

export function DataTable({ data = sampleData }: DataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		goal: true,
		sessionType: true,
		duration: true,
		focusLevel: true,
		quality: true,
		notes: true,
		tags: true,
		sessionDate: true,
	});

	const columns: ColumnDef<DataItem>[] = useMemo(
		() => [
			{
				accessorKey: "goal",
				header: () => <span className="text-xs">Goal</span>,
				cell: ({ row }) => (
					<div className="font-medium min-w-[200px] max-w-[300px]">{row.getValue("goal")}</div>
				),
			},
			{
				accessorKey: "sessionType",
				header: ({ column }) => (
					<div className="dropdown dropdown-bottom">
						<label tabIndex={0} className="btn btn-sm">
							Session Type
							<Filter className="ml-1 h-3 w-3" />
						</label>
						<ul
							tabIndex={0}
							className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
						>
							<li>
								<button
									onClick={() => column.setFilterValue(undefined)}
									className={`text-left text-xs ${
										!column.getFilterValue() ? "bg-base-200" : ""
									}`}
								>
									All Types
								</button>
							</li>
							<li>
								<button
									onClick={() => column.setFilterValue("planned session")}
									className={`text-left text-xs ${
										column.getFilterValue() === "planned session"
											? "bg-base-200"
											: ""
									}`}
								>
									Planned
								</button>
							</li>
							<li>
								<button
									onClick={() => column.setFilterValue("open session")}
									className={`text-left text-xs ${
										column.getFilterValue() === "open session"
											? "bg-base-200"
											: ""
									}`}
								>
									Open
								</button>
							</li>
						</ul>
					</div>
				),
				cell: ({ row }) => {
					const sessionType = row.getValue("sessionType") as string;
					const isPlanned = sessionType === "planned session";
					return (
						<div className="flex items-center gap-2 min-w-[120px]">
							<span
								className={`badge badge-sm badge-secondary ${
									isPlanned ? "badge-soft" : ""
								} rounded-sm`}
							>
								{isPlanned ? (
									<Timer className="size-3" />
								) : (
									<TimerReset className="size-3" />
								)}
								{isPlanned ? "Planned" : "Open"}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: "duration",
				header: ({ column }) => (
					<button
						className="btn btn-sm"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Duration (min)
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4" />
						)}
					</button>
				),
				cell: ({ row }) => {
					const duration = row.getValue("duration") as number;
					const hours = Math.floor(duration / 60);
					const minutes = duration % 60;
					return (
						<div className="min-w-[80px]">
							{hours > 0 && `${hours}h `}
							{minutes}m
						</div>
					);
				},
				filterFn: durationFilter,
			},
			{
				accessorKey: "sessionDate",
				header: ({ column }) => (
					<button
						className="btn btn-sm"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Session Date
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4" />
						)}
					</button>
				),
				cell: ({ row }) => {
					const date = row.getValue("sessionDate") as string;
					return (
						<div className="text-sm min-w-[100px]">{new Date(date).toLocaleDateString()}</div>
					);
				},
			},
			{
				accessorKey: "focusLevel",
				header: () => <span className="text-xs">Focus Level</span>,
				cell: ({ row }) => {
					const focus = row.getValue("focusLevel") as number | null;
					if (focus === null || focus === undefined) {
						return <span className="-content/40 text-sm">—</span>;
					}
					const color =
						focus <= 3
							? "badge-success"
							: focus <= 7
							? "badge-warning"
							: "badge-error";
					return (
						<span className={`badge badge-sm rounded-sm ${color}`}>
							{focus}
						</span>
					);
				},
			},
			{
				accessorKey: "quality",
				header: () => <span className="text-xs">Session Quality</span>,
				cell: ({ row }) => {
					const quality = row.getValue("quality") as number;
					const color =
						quality <= 5
							? "badge-error"
							: quality <= 7
							? "badge-warning"
							: "badge-success";
					return (
						<span className={`badge badge-sm rounded-sm ${color}`}>
							{quality}
						</span>
					);
				},
			},
			{
				accessorKey: "tags",
				header: () => <span className="text-xs">Tags</span>,
				cell: ({ row }) => {
					const tags = row.getValue("tags") as string[];
					if (!tags || tags.length === 0) {
						return <span className="-content/40 text-sm">—</span>;
					}
					return (
						<div className="flex flex-wrap gap-1">
							{tags.map((tag, index) => (
								<span
									key={index}
									className="badge badge-sm rounded-sm badge-neutral
								"
								>
									#{tag}
								</span>
							))}
						</div>
					);
				},
			},
			{
				accessorKey: "notes",
				header: () => <span className="text-xs">Notes</span>,
				cell: ({ row }) => (
					<div className="min-w-[250px] max-w-[400px]">{row.getValue("notes")}</div>
				),
			},
		],
		[]
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			globalFilter,
			columnVisibility,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: globalFilter,
		filterFns: {
			durationFilter,
		},
	});

	// Get unique values for filter dropdowns
	// No longer needed since we removed the filters

	return (
		<div className="w-full space-y-4">
			{/* Search and Filters */}
			<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
				{/* Global Search */}
				<div className="form-control w-full lg:w-96">
					<label className="input bg-base-100 hover:bg-base-200 border-1">
						<Search className="size-4" />
						<input
							type="search"
							className="grow"
							placeholder="Search all columns..."
							value={globalFilter ?? ""}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</label>
				</div>

				{/* Column Visibility Filter */}
				<div className="dropdown dropdown-end">
					<label tabIndex={0} className="btn btn-sm">
						<Eye className="h-4 w-4 mr-1" />
						Columns
					</label>
					<ul
						tabIndex={0}
						className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
					>
						{Object.keys(columnVisibility).map((columnId) => (
							<li key={columnId}>
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										className="checkbox checkbox-sm"
										checked={
											columnVisibility[columnId as keyof VisibilityState]
										}
										onChange={(e) => {
											setColumnVisibility((prev) => ({
												...prev,
												[columnId]: e.target.checked,
											}));
										}}
									/>
									<span className="capitalize">
										{columnId === "focusLevel"
											? "Focus Level"
											: columnId === "sessionType"
											? "Session Type"
											: columnId === "sessionDate"
											? "Session Date"
											: columnId === "notes"
											? "Notes"
											: columnId === "tags"
											? "Tags"
											: columnId}
									</span>
								</label>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto rounded-box border-base-100 border">
				<table className="table table-sm table-zebra w-full min-w-full">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className="bg-base-200 p-1 ">
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
					<tbody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="hover">
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columns.length} className="h-24 text-center">
									No results found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<button
						className="btn btn-sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</button>
					<button
						className="btn btn-sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</button>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-sm text-base-content">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</span>
					<select
						className="select select-bordered select-sm"
						value={table.getState().pagination.pageSize}
						onChange={(e) => {
							table.setPageSize(Number(e.target.value));
						}}
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Results Summary */}
			<div className="text-sm text-base-content opacity-70">
				Showing {table.getFilteredRowModel().rows.length} of {data.length} total
				results
			</div>
		</div>
	);
}
