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
	ColumnOrderState,
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
	Check,
	X,
	Edit3,
} from "lucide-react";
import { DataItem, mockDataTableData } from "../../data/mockDataTable";
import { useUpdateSession } from "@/src/hooks/useSessionsQuery";
import { SessionEditModal } from "./session-edit-modal";
import { toast } from "sonner";

// Custom filter function for duration
const durationFilter: FilterFn<DataItem> = (row, columnId, filterValue) => {
	const duration = row.getValue(columnId) as number;
	const [min, max] = filterValue as [number, number];
	return duration >= min && duration <= max;
};

// Custom filter function for tags
const tagsFilter: FilterFn<DataItem> = (row, columnId, filterValue) => {
	const tags = row.getValue(columnId) as string[];
	const selectedTags = filterValue as string[];

	if (!selectedTags || selectedTags.length === 0) return true;

	// Check if any of the selected tags exist in the row's tags
	return selectedTags.some((selectedTag) => tags.includes(selectedTag));
};

// Global filter function
const globalFilterFn = (row: any, columnId: any, filterValue: any) => {
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

export function DataTable({ data = mockDataTableData }: DataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		goal: true,
		sessionType: true,
		duration: true,
		quality: false,
		notes: true,
		tags: true,
		sessionDate: true,
	});
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
		"goal",
		"sessionType",
		"duration",
		"sessionDate",
		"quality",
		"tags",
		"notes",
		"actions",
	]);
	const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
	const [tagsSearchTerm, setTagsSearchTerm] = useState("");
	const [editingSession, setEditingSession] = useState<DataItem | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const updateSession = useUpdateSession();

	const isRowLocked = (row: any) => {
		const status = (row.original as any)?.status as string | undefined;
		return status === "active" || status === "paused";
	};

	const openEditModal = (session: DataItem) => {
		const status = (session as any)?.status as string | undefined;
		if (status === "active" || status === "paused") {
			toast.warning("Cannot edit active session", {
				description: "Please wait for the session to end before editing",
			});
			return;
		}
		setEditingSession(session);
		setIsModalOpen(true);
	};

	const closeEditModal = () => {
		setIsModalOpen(false);
		setEditingSession(null);
	};

	const handleEditSuccess = () => {
		// Success toast is handled in the modal
		console.log("Session updated successfully");
	};

	// Minimum widths per column to keep layout readable
	const columnMinWidth: Record<string, string> = {
		goal: "min-w-[200px]",
		sessionType: "min-w-[120px]",
		duration: "min-w-[80px]",
		sessionDate: "min-w-[100px]",
		quality: "min-w-[100px]",
		tags: "min-w-[160px]",
		notes: "min-w-[250px]",
	};

	// Helper component for available tags list
	const AvailableTagsList = ({
		column,
		data,
		searchTerm,
	}: {
		column: any;
		data: DataItem[];
		searchTerm: string;
	}) => {
		const getFilterValueAsStringArray = (column: any): string[] => {
			const value = column.getFilterValue();
			return Array.isArray(value) ? value : [];
		};
		// Count occurrences of each tag, filtering out invalid tags
		const tagCounts = data.reduce((acc, item) => {
			(item.tags || []).forEach((tag) => {
				if (tag && typeof tag === "string" && tag.trim() !== "") {
					acc[tag] = (acc[tag] || 0) + 1;
				}
			});
			return acc;
		}, {} as Record<string, number>);

		// Filter and sort tags by count (highest first)
		const sortedTags = Object.entries(tagCounts)
			.filter(([tag]) => {
				// Ensure tag is valid before filtering
				if (!tag || typeof tag !== "string") return false;

				return (
					searchTerm === "" ||
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);
			})
			.sort(([, a], [, b]) => b - a)
			.map(([tag]) => tag)
			.filter((tag): tag is string => tag !== null && typeof tag === "string");

		return (
			<ul className="max-h-52 space-y-1">
				{sortedTags.length === 0 ? (
					<li className="text-center text-sm text-base-content/60 py-4">
						No tags found matching "{searchTerm}"
					</li>
				) : (
					sortedTags.map((tag) => {
						const currentTags = getFilterValueAsStringArray(column);
						const isSelected = currentTags.includes(tag);
						const count = tagCounts[tag];

						return (
							<li key={tag}>
								<button
									onClick={() => {
										if (isSelected) {
											// Remove tag
											const newTags = currentTags.filter((t) => t !== tag);
											column.setFilterValue(
												newTags.length > 0 ? newTags : undefined
											);
										} else {
											// Add tag
											const newTags = [...currentTags, tag];
											column.setFilterValue(newTags);
										}
									}}
									className={`w-full text-left p-2 hover:bg-base-200 transition-colors flex justify-between items-center ${
										isSelected ? "bg-primary/20 text-primary" : ""
									}`}
								>
									<span>#{tag}</span>
									<span className="badge  rounded-sm aspect-square badge-xs badge-neutral ml-2">
										{count}
									</span>
								</button>
							</li>
						);
					})
				)}
			</ul>
		);
	};

	const columns: ColumnDef<DataItem>[] = useMemo(
		() => [
			{
				id: "actions",
				header: () => null,
				cell: ({ row }) => {
					const locked = isRowLocked(row);
					const session = row.original as DataItem;
					return (
						<div className="flex items-center justify-end gap-1">
							<button
								title={
									locked
										? "Editing available after session ends"
										: "Edit session"
								}
								className={`btn btn-xs btn-ghost btn-square ${
									locked ? "opacity-50" : ""
								}`}
								onClick={() => openEditModal(session)}
							>
								<Edit3 className="size-3" />
							</button>
						</div>
					);
				},
			},
			{
				accessorKey: "goal",
				header: () => <span className="text-xs">Goal</span>,
				cell: ({ row }) => (
					<div className="font-medium min-w-[200px] max-w-[300px]">
						{row.getValue("goal")}
					</div>
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
							className="dropdown-content border border-base-200 z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
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
									{column.getFilterValue() === "open session" && (
										<Check className="size-3" />
									)}
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
								className={`badge badge-sm badge-soft  ${
									isPlanned ? "badge-accent" : "badge-info"
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
						<div className="text-sm min-w-[100px]">
							{new Date(date).toLocaleDateString()}
						</div>
					);
				},
			},
			{
				accessorKey: "quality",
				header: () => <span className="text-xs">Quality</span>,
				cell: ({ row }) => {
					const quality = row.getValue("quality") as number;
					const color =
						quality <= 5
							? "badge-error"
							: quality <= 7
							? "badge-warning"
							: "badge-success";
					return (
						<span className={`badge badge-sm badge-soft rounded-sm ${color}`}>
							{quality}
						</span>
					);
				},
			},
			{
				accessorKey: "tags",
				header: ({ column }) => (
					<div className="dropdown dropdown-bottom">
						<label tabIndex={0} className="btn btn-sm">
							Tags
							<Filter className="ml-1 h-3 w-3" />
						</label>
						<div
							tabIndex={0}
							className="dropdown-content border border-base-200 z-[1] p-2 shadow bg-base-100 rounded-box w-64"
						>
							{/* Search Input */}
							<div className="form-control mb-2">
								<div className="input-group">
									<input
										type="text"
										placeholder="Search tags..."
										className="input input-sm input-bordered w-full"
										value={tagsSearchTerm}
										onChange={(e) => setTagsSearchTerm(e.target.value)}
									/>
									{tagsSearchTerm && (
										<button
											className="btn btn-sm btn-square"
											onClick={() => setTagsSearchTerm("")}
											title="Clear search"
										>
											<X className="h-3 w-3" />
										</button>
									)}
								</div>
							</div>

							{/* Selected Tags Display */}
							{
								(() => {
									const getFilterValueAsStringArray = (
										column: any
									): string[] => {
										const value = column.getFilterValue();
										return Array.isArray(value) ? value : [];
									};

									const filterValue = getFilterValueAsStringArray(column);
									if (filterValue.length === 0) return null;

									const selectedTagsDisplay = (
										<div className="mb-2">
											<div className="text-xs text-base-content/70 mb-1">
												Selected:
											</div>
											<div className="flex flex-wrap gap-1">
												{filterValue.map((tag, index) => (
													<span
														key={index}
														className="badge rounded-sm badge-sm badge-primary"
													>
														#{tag}
														<button
															onClick={() => {
																const newTags = filterValue.filter(
																	(_, i) => i !== index
																);
																column.setFilterValue(
																	newTags.length > 0 ? newTags : undefined
																);
															}}
															className="ml-1 hover:bg-primary-focus rounded-full w-3 h-3 flex items-center justify-center text-xs"
														>
															×
														</button>
													</span>
												))}
											</div>
										</div>
									);

									return selectedTagsDisplay;
								})() as any // May god help me with typescript
							}

							{/* Available Tags List */}
							<AvailableTagsList
								column={column}
								data={data}
								searchTerm={tagsSearchTerm}
							/>

							{/* Clear All Button */}
							{column.getFilterValue() && (
								<div className="mt-2 pt-2 border-t border-base-200">
									<button
										onClick={() => {
											column.setFilterValue(undefined);
											setTagsSearchTerm("");
										}}
										className="btn btn-sm btn-soft btn-error w-full"
									>
										Clear All
									</button>
								</div>
							)}
						</div>
					</div>
				),
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
									className="badge badge-sm rounded-sm badge-soft badge-neutral"
								>
									#{tag}
								</span>
							))}
						</div>
					);
				},
				filterFn: tagsFilter,
			},
			{
				accessorKey: "notes",
				header: () => <span className="text-xs text-wrap">Notes</span>,
				cell: ({ row }) => (
					<div className="min-w-[250px] max-w-[480px]">
						{row.getValue("notes")}
					</div>
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
			columnOrder,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnOrderChange: setColumnOrder,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: globalFilterFn,
		filterFns: {
			durationFilter,
			tagsFilter,
		},
	});

	// Get unique values for filter dropdowns
	// No longer needed since we removed the filters

	return (
		<div className="w-full bg-card border-border border rounded-box overflow-hidden">
			{/* Search and Filters */}
			{/* Header */}
			<div className="flex p-4 border-b-1 border-border flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
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

				<div className="flex gap-2">
					{/* Reset Filters Button - Only show when filters are applied */}
					{(globalFilter ||
						columnFilters.length > 0 ||
						sorting.length > 0 ||
						(table.getColumn("sessionType")?.getFilterValue() as string)) && (
						<button
							onClick={() => {
								// Reset all filters
								setGlobalFilter("");
								setColumnFilters([]);
								setSorting([]);
								// Reset session type filter specifically
								table.getColumn("sessionType")?.setFilterValue(undefined);
							}}
							className="btn btn-sm btn-soft btn-error"
							title="Reset all filters and sorting"
						>
							<X className="h-4 w-4 mr-1" />
							Reset Filters
						</button>
					)}

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
			</div>
			{/* Table */}
			<div className="overflow-y-auto w-full" aria-live="polite">
				<table className="table rounded-none w-full min-w-full">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className={`bg-base-300 dark:bg-base-100 cursor-move hover:bg-base-300 transition-all duration-200 relative ${
											dragOverColumn === header.id
												? "ring-2 ring-primary ring-opacity-50 bg-primary/10"
												: ""
										} ${columnMinWidth[header.column.id as string] ?? ""}`}
										onDragStart={(e) => {
											e.dataTransfer.effectAllowed = "move";
											e.dataTransfer.setData("text/plain", header.id);
										}}
										onDragOver={(e) => {
											e.preventDefault();
											e.dataTransfer.dropEffect = "move";
											setDragOverColumn(header.id);
										}}
										onDragLeave={() => {
											setDragOverColumn(null);
										}}
										onDrop={(e) => {
											e.preventDefault();
											setDragOverColumn(null);
											const draggedId = e.dataTransfer.getData("text/plain");
											const dropId = header.id;

											if (draggedId !== dropId) {
												const oldIndex = table
													.getState()
													.columnOrder.indexOf(draggedId);
												const newIndex = table
													.getState()
													.columnOrder.indexOf(dropId);

												const newOrder = [...table.getState().columnOrder];
												const [draggedColumn] = newOrder.splice(oldIndex, 1);
												newOrder.splice(newIndex, 0, draggedColumn);

												setColumnOrder(newOrder);
											}
										}}
										draggable
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}

										{/* Drop indicator */}
										{dragOverColumn === header.id && (
											<div className="absolute inset-0 pointer-events-none">
												<div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-full animate-pulse"></div>
											</div>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="hover hover:bg-base-300/50 transition-all ease-out"
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className={`whitespace-normal break-words ${
												columnMinWidth[cell.column.id as string] ?? ""
											}`}
										>
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
								<td colSpan={columns.length} className="h-32 text-center">
									<div className="flex flex-col items-center justify-center space-y-3 py-8">
										<div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center">
											<Search className="w-8 h-8 text-base-content/40" />
										</div>
										<div className="text-center">
											<h3 className="text-lg font-semibold text-base-content mb-2">
												No results found
											</h3>
											<p className="text-base-content/60 text-sm max-w-md">
												Try adjusting your search terms or filters to find what
												you're looking for.
											</p>
										</div>
										{(globalFilter ||
											columnFilters.length > 0 ||
											(table
												.getColumn("sessionType")
												?.getFilterValue() as string)) && (
											<button
												onClick={() => {
													setGlobalFilter("");
													setColumnFilters([]);
													table
														.getColumn("sessionType")
														?.setFilterValue(undefined);
												}}
												className="btn btn-sm "
											>
												Clear all filters
											</button>
										)}
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{/* Pagination */}
			<div className="flex items-center p-4 bg-base-200 justify-between">
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

				{/* Results Summary */}
				<div className="text-xs text-base-content/50">
					Showing {table.getFilteredRowModel().rows.length} of {data.length}{" "}
					total results
				</div>

				<div className="flex items-center gap-2">
					<select
						className="select select-sm"
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

			{/* Session Edit Modal */}
			<SessionEditModal
				isOpen={isModalOpen}
				onClose={closeEditModal}
				session={editingSession}
				onSuccess={handleEditSuccess}
			/>
		</div>
	);
}
