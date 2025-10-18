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
	ColumnFiltersState,
	GlobalFilterFn,
	Row,
} from "@tanstack/react-table";
import {
	Search,
	Filter,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Edit3,
	Trash2,
	Check,
	X,
	Plus,
	BarChart3,
} from "lucide-react";
import { DataItem } from "./data-table";

// Custom filter function for duration
const durationFilter: FilterFn<DataItem> = (row, columnId, filterValue) => {
	const duration = row.getValue(columnId) as number;
	const [min, max] = filterValue as [number, number];
	return duration >= min && duration <= max;
};

// Global filter function
const globalFilter: GlobalFilterFn<DataItem> = (row, columnId, filterValue) => {
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

interface EditableDataTableProps {
	data: DataItem[];
	onDataChange: (newData: DataItem[]) => void;
	showStatistics?: boolean;
}

export function EditableDataTable({
	data,
	onDataChange,
	showStatistics = true,
}: EditableDataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [durationRange, setDurationRange] = useState<[number, number]>([
		0, 300,
	]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingData, setEditingData] = useState<Partial<DataItem>>({});
	const [showAddForm, setShowAddForm] = useState(false);
	const [newItem, setNewItem] = useState<Partial<DataItem>>({
		goal: "",
		sessionType: "planned session",
		duration: 0,
		quality: 7,
		notes: "",
	});

	// Statistics
	const statistics = useMemo(() => {
		const total = data.length;
		const active = data.filter((item) => item.status === "active").length;
		const pending = data.filter((item) => item.status === "pending").length;
		const inactive = data.filter((item) => item.status === "inactive").length;
		const totalDuration = data.reduce((sum, item) => sum + item.duration, 0);
		const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;

		return { total, active, pending, inactive, totalDuration, avgDuration };
	}, [data]);

	const columns: ColumnDef<DataItem>[] = useMemo(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<button
						className="btn btn-ghost btn-sm"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Name
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
					const isEditing = editingId === row.id;
					const value = row.getValue("name") as string;

					if (isEditing) {
						return (
							<input
								type="text"
								className="input input-bordered input-sm w-full"
								value={editingData.name || value}
								onChange={(e) =>
									setEditingData((prev) => ({ ...prev, name: e.target.value }))
								}
							/>
						);
					}

					return <div className="font-medium">{value}</div>;
				},
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => {
					const isEditing = editingId === row.id;
					const value = row.getValue("status") as string;

					if (isEditing) {
						return (
							<select
								className="select select-bordered select-sm w-full"
								value={editingData.status || value}
								onChange={(e) =>
									setEditingData((prev) => ({
										...prev,
										status: e.target.value as any,
									}))
								}
							>
								<option value="active">active</option>
								<option value="pending">pending</option>
								<option value="inactive">inactive</option>
							</select>
						);
					}

					const statusColors = {
						active: "badge badge-success",
						inactive: "badge badge-error",
						pending: "badge badge-warning",
					};
					return (
						<span className={statusColors[value as keyof typeof statusColors]}>
							{value}
						</span>
					);
				},
				filterFn: "equals",
			},
			{
				accessorKey: "duration",
				header: ({ column }) => (
					<button
						className="btn btn-ghost btn-sm"
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
					const isEditing = editingId === row.id;
					const value = row.getValue("duration") as number;

					if (isEditing) {
						return (
							<input
								type="number"
								className="input input-bordered input-sm w-full"
								value={editingData.duration || value}
								onChange={(e) =>
									setEditingData((prev) => ({
										...prev,
										duration: parseInt(e.target.value) || 0,
									}))
								}
							/>
						);
					}

					const hours = Math.floor(value / 60);
					const minutes = value % 60;
					return (
						<div>
							{hours > 0 && `${hours}h `}
							{minutes}m
						</div>
					);
				},
				filterFn: durationFilter,
			},
			{
				accessorKey: "category",
				header: "Category",
				cell: ({ row }) => {
					const isEditing = editingId === row.id;
					const value = row.getValue("category") as string;

					if (isEditing) {
						return (
							<input
								type="text"
								className="input input-bordered input-sm w-full"
								value={editingData.category || value}
								onChange={(e) =>
									setEditingData((prev) => ({
										...prev,
										category: e.target.value,
									}))
								}
							/>
						);
					}

					return <div>{value}</div>;
				},
				filterFn: "equals",
			},
			{
				accessorKey: "priority",
				header: "Priority",
				cell: ({ row }) => {
					const isEditing = editingId === row.id;
					const value = row.getValue("priority") as string;

					if (isEditing) {
						return (
							<select
								className="select select-bordered select-sm w-full"
								value={editingData.priority || value}
								onChange={(e) =>
									setEditingData((prev) => ({
										...prev,
										priority: e.target.value as any,
									}))
								}
							>
								<option value="low">low</option>
								<option value="medium">medium</option>
								<option value="high">high</option>
							</select>
						);
					}

					const priorityColors = {
						low: "badge badge-info",
						medium: "badge badge-warning",
						high: "badge badge-error",
					};
					return (
						<span
							className={priorityColors[value as keyof typeof priorityColors]}
						>
							{value}
						</span>
					);
				},
				filterFn: "equals",
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => (
					<button
						className="btn btn-ghost btn-sm"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Created
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
					const isEditing = editingId === row.id;
					const value = row.getValue("createdAt") as string;

					if (isEditing) {
						return (
							<input
								type="date"
								className="input input-bordered input-sm w-full"
								value={editingData.createdAt || value}
								onChange={(e) =>
									setEditingData((prev) => ({
										...prev,
										createdAt: e.target.value,
									}))
								}
							/>
						);
					}

					const date = new Date(value);
					return <div>{date.toLocaleDateString()}</div>;
				},
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => {
					const isEditing = editingId === row.id;

					if (isEditing) {
						return (
							<div className="flex gap-1">
								<button
									className="btn btn-success btn-sm"
									onClick={() => handleSaveEdit(row.id)}
								>
									<Check className="h-3 w-3" />
								</button>
								<button
									className="btn btn-error btn-sm"
									onClick={() => handleCancelEdit()}
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						);
					}

					return (
						<div className="flex gap-1">
							<button
								className="btn btn-primary btn-sm"
								onClick={() => handleStartEdit(row.original)}
							>
								<Edit3 className="h-3 w-3" />
							</button>
							<button
								className="btn btn-error btn-sm"
								onClick={() => handleDelete(row.id)}
							>
								<Trash2 className="h-3 w-3" />
							</button>
						</div>
					);
				},
			},
		],
		[editingId, editingData]
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
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
	const statusOptions = [...new Set(data.map((item) => item.status))];
	const categoryOptions = [...new Set(data.map((item) => item.category))];
	const priorityOptions = [...new Set(data.map((item) => item.priority))];

	const handleStartEdit = (item: DataItem) => {
		setEditingId(item.id);
		setEditingData({});
	};

	const handleSaveEdit = (id: string) => {
		const updatedData = data.map((item) =>
			item.id === id ? { ...item, ...editingData } : item
		);
		onDataChange(updatedData);
		setEditingId(null);
		setEditingData({});
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditingData({});
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this item?")) {
			const updatedData = data.filter((item) => item.id !== id);
			onDataChange(updatedData);
		}
	};

	const handleAddItem = () => {
		if (newItem.goal && newItem.sessionType) {
			const item: DataItem = {
				id: Date.now().toString(),
				goal: newItem.goal,
				sessionType: newItem.sessionType,
				duration: newItem.duration || 0,
				quality: newItem.quality || 7,
				tags: newItem.tags || [],
				notes: newItem.notes || "",
			};

			onDataChange([...data, item]);
			setNewItem({
				goal: "",
				sessionType: "planned session",
				duration: 0,
				quality: 7,
				tags: [],
				notes: "",
			});
			setShowAddForm(false);
		}
	};

	return (
		<div className="w-full space-y-4">
			{/* Statistics */}
			{showStatistics && (
				<div className="stats shadow w-full">
					<div className="stat">
						<div className="stat-figure text-primary">
							<BarChart3 className="h-8 w-8" />
						</div>
						<div className="stat-title">Total Items</div>
						<div className="stat-value text-primary">{statistics.total}</div>
						<div className="stat-desc">
							{statistics.active} active, {statistics.pending} pending
						</div>
					</div>

					<div className="stat">
						<div className="stat-figure text-secondary">
							<BarChart3 className="h-8 w-8" />
						</div>
						<div className="stat-title">Total Duration</div>
						<div className="stat-value text-secondary">
							{Math.floor(statistics.totalDuration / 60)}h{" "}
							{statistics.totalDuration % 60}m
						</div>
						<div className="stat-desc">
							Avg: {Math.floor(statistics.avgDuration / 60)}h{" "}
							{statistics.avgDuration % 60}m
						</div>
					</div>
				</div>
			)}

			{/* Add Item Form */}
			{showAddForm && (
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<h3 className="card-title">Add New Item</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div className="form-control">
								<label className="label">
									<span className="label-text">Name</span>
								</label>
								<input
									type="text"
									className="input input-bordered"
									value={newItem.name}
									onChange={(e) =>
										setNewItem((prev) => ({ ...prev, name: e.target.value }))
									}
									placeholder="Item name"
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Category</span>
								</label>
								<input
									type="text"
									className="input input-bordered"
									value={newItem.category}
									onChange={(e) =>
										setNewItem((prev) => ({
											...prev,
											category: e.target.value,
										}))
									}
									placeholder="Category"
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Duration (minutes)</span>
								</label>
								<input
									type="number"
									className="input input-bordered"
									value={newItem.duration}
									onChange={(e) =>
										setNewItem((prev) => ({
											...prev,
											duration: parseInt(e.target.value) || 0,
										}))
									}
									placeholder="0"
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Status</span>
								</label>
								<select
									className="select select-bordered"
									value={newItem.status}
									onChange={(e) =>
										setNewItem((prev) => ({
											...prev,
											status: e.target.value as any,
										}))
									}
								>
									<option value="pending">pending</option>
									<option value="active">active</option>
									<option value="inactive">inactive</option>
								</select>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Priority</span>
								</label>
								<select
									className="select select-bordered"
									value={newItem.priority}
									onChange={(e) =>
										setNewItem((prev) => ({
											...prev,
											priority: e.target.value as any,
										}))
									}
								>
									<option value="low">low</option>
									<option value="medium">medium</option>
									<option value="high">high</option>
								</select>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Created Date</span>
								</label>
								<input
									type="date"
									className="input input-bordered"
									value={newItem.createdAt}
									onChange={(e) =>
										setNewItem((prev) => ({
											...prev,
											createdAt: e.target.value,
										}))
									}
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Session Type</span>
								</label>
								<select
									className="select select-bordered"
									value={newItem.sessionType as string}
									onChange={(e) =>
										setNewItem((prev) => ({
											...prev,
											sessionType: e.target.value as
												| "planned session"
												| "open session",
										}))
									}
								>
									<option value="planned session">Planned Session</option>
									<option value="open session">Open Session</option>
								</select>
							</div>
						</div>

						<div className="card-actions justify-end mt-4">
							<button
								className="btn btn-ghost"
								onClick={() => setShowAddForm(false)}
							>
								Cancel
							</button>
							<button className="btn btn-primary" onClick={handleAddItem}>
								Add Item
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Search and Filters */}
			<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
				{/* Global Search */}
				<div className="form-control w-full lg:w-96">
					<div className="input-group">
						<span className="btn btn-square btn-sm">
							<Search className="h-4 w-4" />
						</span>
						<input
							type="text"
							placeholder="Search all columns..."
							className="input input-bordered w-full"
							value={globalFilter ?? ""}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</div>
				</div>

				{/* Column Filters */}
				<div className="flex flex-wrap gap-2">
					{/* Status Filter */}
					<div className="form-control w-full sm:w-40">
						<select
							className="select select-bordered select-sm"
							value={
								(table.getColumn("status")?.getFilterValue() as string) || ""
							}
							onChange={(e) => {
								const value = e.target.value;
								table.getColumn("status")?.setFilterValue(value || undefined);
							}}
						>
							<option value="">All Status</option>
							{statusOptions.map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>
					</div>

					{/* Category Filter */}
					<div className="form-control w-full sm:w-40">
						<select
							className="select select-bordered select-sm"
							value={
								(table.getColumn("category")?.getFilterValue() as string) || ""
							}
							onChange={(e) => {
								const value = e.target.value;
								table.getColumn("category")?.setFilterValue(value || undefined);
							}}
						>
							<option value="">All Categories</option>
							{categoryOptions.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					{/* Priority Filter */}
					<div className="form-control w-full sm:w-40">
						<select
							className="select select-bordered select-sm"
							value={
								(table.getColumn("priority")?.getFilterValue() as string) || ""
							}
							onChange={(e) => {
								const value = e.target.value;
								table.getColumn("priority")?.setFilterValue(value || undefined);
							}}
						>
							<option value="">All Priorities</option>
							{priorityOptions.map((priority) => (
								<option key={priority} value={priority}>
									{priority}
								</option>
							))}
						</select>
					</div>

					{/* Duration Range Filter */}
					<div className="form-control w-full sm:w-48">
						<div className="flex items-center gap-2">
							<input
								type="number"
								placeholder="Min"
								className="input input-bordered input-sm w-20"
								value={durationRange[0]}
								onChange={(e) =>
									setDurationRange([
										parseInt(e.target.value) || 0,
										durationRange[1],
									])
								}
								onBlur={() => {
									table.getColumn("duration")?.setFilterValue(durationRange);
								}}
							/>
							<span className="text-sm">-</span>
							<input
								type="number"
								placeholder="Max"
								className="input input-bordered input-sm w-20"
								value={durationRange[1]}
								onChange={(e) =>
									setDurationRange([
										durationRange[0],
										parseInt(e.target.value) || 300,
									])
								}
								onBlur={() => {
									table.getColumn("duration")?.setFilterValue(durationRange);
								}}
							/>
							<span className="text-sm">min</span>
						</div>
					</div>

					{/* Add Item Button */}
					<button
						className="btn btn-primary btn-sm"
						onClick={() => setShowAddForm(!showAddForm)}
					>
						<Plus className="h-4 w-4 mr-1" />
						Add Item
					</button>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="table table-zebra w-full">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className="bg-base-200">
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
