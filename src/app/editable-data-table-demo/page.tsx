"use client";

import { useState } from "react";
import { EditableDataTable } from "../../components/ui/editable-data-table";
import { DataItem } from "../../components/ui/data-table";

// Extended sample data for demonstration
const initialData: DataItem[] = [
	{
		id: "1",
		goal: "Complete API integration",
		sessionType: "planned session",
		duration: 120,
		focusLevel: 8,
		quality: 9,
		notes: "Had some interruptions but completed core functionality",
		tags: ["coding", "api", "backend"],
	},
	{
		id: "2",
		goal: "Draft blog post outline",
		sessionType: "open session",
		duration: 45,
		focusLevel: null,
		quality: 8,
		notes: "Good flow; outline is comprehensive",
		tags: ["writing", "content"],
	},
	{
		id: "3",
		goal: "Meeting Gamma",
		sessionType: "planned session",
		duration: 90,
		focusLevel: 6,
		quality: 7,
		notes: "Productive planning session",
		tags: ["meeting", "planning"],
	},
	{
		id: "4",
		goal: "Review Delta",
		sessionType: "open session",
		duration: 30,
		focusLevel: 7,
		quality: 8,
		notes: "Quick but thorough review",
		tags: ["review", "code"],
	},
	{
		id: "5",
		goal: "Testing Epsilon",
		sessionType: "planned session",
		duration: 180,
		focusLevel: 9,
		quality: 9,
		notes: "Comprehensive testing completed",
		tags: ["testing", "qa"],
	},
	{
		id: "6",
		goal: "Documentation Zeta",
		sessionType: "open session",
		duration: 60,
		focusLevel: 5,
		quality: 6,
		notes: "Basic documentation updated",
		tags: ["documentation"],
	},
	{
		id: "7",
		goal: "Bug Fix Eta",
		sessionType: "planned session",
		duration: 15,
		focusLevel: 8,
		quality: 7,
		notes: "Quick bug fix implemented",
		tags: ["bugfix", "coding"],
	},
	{
		id: "8",
		goal: "Code Review Theta",
		sessionType: "open session",
		duration: 75,
		focusLevel: 7,
		quality: 8,
		notes: "Thorough code review completed",
		tags: ["review", "code"],
	},
	{
		id: "9",
		goal: "Sprint Planning Iota",
		sessionType: "planned session",
		duration: 150,
		focusLevel: 6,
		quality: 7,
		notes: "Sprint planning session",
		tags: ["planning", "agile"],
	},
	{
		id: "10",
		goal: "User Research Kappa",
		sessionType: "open session",
		duration: 200,
		focusLevel: 8,
		quality: 9,
		notes: "Valuable user insights gathered",
		tags: ["research", "ux"],
	},
];

export default function EditableDataTableDemoPage() {
	const [data, setData] = useState<DataItem[]>(initialData);

	const handleDataChange = (newData: DataItem[]) => {
		setData(newData);
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold text-primary">
					Editable Data Table Demo
				</h1>
				<p className="text-lg text-base-content opacity-70">
					Advanced data table with inline editing, adding items, and real-time
					statistics
				</p>
			</div>

			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-2xl mb-4">Advanced Features</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Inline Editing</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Add New Items</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Delete Items</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Real-time Statistics</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Data Persistence</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Responsive Design</span>
						</div>
					</div>
				</div>
			</div>

			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-2xl mb-4">
						Interactive Editable Table
					</h2>
					<EditableDataTable
						data={data}
						onDataChange={handleDataChange}
						showStatistics={true}
					/>
				</div>
			</div>

			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-2xl mb-4">Usage Instructions</h2>
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold text-lg">✏️ Inline Editing</h3>
							<p className="text-base-content opacity-70">
								Click the edit button (pencil icon) on any row to enable inline
								editing. Make your changes and click the checkmark to save or X
								to cancel.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">➕ Adding Items</h3>
							<p className="text-base-content opacity-70">
								Click the &quot;Add Item&quot; button to show a form for
								creating new items. Fill in the required fields and click
								&quot;Add Item&quot; to add it to the table.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">🗑️ Deleting Items</h3>
							<p className="text-base-content opacity-70">
								Click the delete button (trash icon) on any row to remove it
								from the table. You&apos;ll be asked to confirm the deletion.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">📊 Statistics</h3>
							<p className="text-base-content opacity-70">
								View real-time statistics at the top of the table including
								total items, status breakdown, and duration calculations.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">🔍 Search & Filtering</h3>
							<p className="text-base-content opacity-70">
								Use the search bar and filters to find specific items. All
								filters work together and update the statistics in real-time.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">📄 Pagination</h3>
							<p className="text-base-content opacity-70">
								Navigate through pages and adjust the number of items displayed
								per page. The table maintains your current filters and sorting
								across page changes.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-2xl mb-4">Data Management</h2>
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold text-lg">💾 Data Persistence</h3>
							<p className="text-base-content opacity-70">
								All changes (edits, additions, deletions) are immediately
								reflected in the table. In a real application, you would
								typically save this data to a backend or local storage.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">🔄 Real-time Updates</h3>
							<p className="text-base-content opacity-70">
								Statistics, filters, and search results update automatically as
								you modify the data. The table maintains consistency across all
								operations.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">🎯 Validation</h3>
							<p className="text-base-content opacity-70">
								Basic validation ensures required fields are filled before
								adding new items. You can extend this with more sophisticated
								validation rules.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
