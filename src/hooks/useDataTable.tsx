import { useState, useMemo } from "react";
import { DataItem } from "../components/ui/data-table";

export function useDataTable(initialData: DataItem[] = []) {
	const [data, setData] = useState<DataItem[]>(initialData);
	const [searchTerm, setSearchTerm] = useState("");
	const [sessionTypeFilter, setSessionTypeFilter] = useState<string>("");
	const [durationRange, setDurationRange] = useState<[number, number]>([
		0, 300,
	]);

	// Get unique values for filter options
	const filterOptions = useMemo(() => {
		const sessionTypes = [...new Set(data.map((item) => item.sessionType))];
		return { sessionTypes };
	}, [data]);

	// Filter data based on current filters
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			// Search filter
			if (searchTerm) {
				const searchLower = searchTerm.toLowerCase();
				const matchesSearch =
					item.goal.toLowerCase().includes(searchLower) ||
					item.sessionType.toLowerCase().includes(searchLower) ||
					item.notes.toLowerCase().includes(searchLower);

				if (!matchesSearch) return false;
			}

			// Session type filter
			if (sessionTypeFilter && item.sessionType !== sessionTypeFilter)
				return false;

			// Duration range filter
			if (item.duration < durationRange[0] || item.duration > durationRange[1])
				return false;

			return true;
		});
	}, [data, searchTerm, sessionTypeFilter, durationRange]);

	// Add new item
	const addItem = (item: Omit<DataItem, "id">) => {
		const newItem: DataItem = {
			...item,
			id: Date.now().toString(),
		};
		setData((prev) => [...prev, newItem]);
	};

	// Update item
	const updateItem = (id: string, updates: Partial<DataItem>) => {
		setData((prev) =>
			prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
		);
	};

	// Delete item
	const deleteItem = (id: string) => {
		setData((prev) => prev.filter((item) => item.id !== id));
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchTerm("");
		setSessionTypeFilter("");
		setDurationRange([0, 300]);
	};

	// Get statistics
	const statistics = useMemo(() => {
		const total = data.length;
		const filtered = filteredData.length;
		const totalDuration = data.reduce((sum, item) => sum + item.duration, 0);
		const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;

		return {
			total,
			filtered,
			totalDuration,
			avgDuration,
		};
	}, [data, filteredData]);

	return {
		// Data
		data,
		filteredData,

		// Filters
		searchTerm,
		setSearchTerm,
		sessionTypeFilter,
		setSessionTypeFilter,
		durationRange,
		setDurationRange,

		// Filter options
		filterOptions,

		// Actions
		addItem,
		updateItem,
		deleteItem,
		clearFilters,

		// Statistics
		statistics,
	};
}
