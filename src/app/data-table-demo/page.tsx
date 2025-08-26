import { DataTable, DataItem } from "../../components/ui/data-table";

// Extended sample data for demonstration
const extendedData: DataItem[] = [
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
	{
		id: "11",
		goal: "API Integration Lambda",
		sessionType: "planned session",
		duration: 300,
		focusLevel: 9,
		quality: 10,
		notes: "API integration completed successfully",
		tags: ["coding", "api", "integration"],
	},
	{
		id: "12",
		goal: "UI Mockup Mu",
		sessionType: "open session",
		duration: 80,
		focusLevel: 7,
		quality: 8,
		notes: "UI mockup created",
		tags: ["design", "ui", "mockup"],
	},
];

export default function DataTableDemoPage() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold text-primary">Data Table Demo</h1>
				<p className="text-lg text-base-content opacity-70">
					A comprehensive data table built with TanStack Table and DaisyUI
					components
				</p>
			</div>

			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-2xl mb-4">Features</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Global Search</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Column Filtering</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Sortable Columns</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Duration Range Filter</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="badge badge-primary">✓</div>
							<span>Pagination</span>
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
					<h2 className="card-title text-2xl mb-4">Interactive Data Table</h2>
					<DataTable data={extendedData} />
				</div>
			</div>

			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-2xl mb-4">Usage Instructions</h2>
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold text-lg">🔍 Global Search</h3>
							<p className="text-base-content opacity-70">
								Use the search bar to search across all columns. It will filter
								results in real-time.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">🎯 Column Filters</h3>
							<p className="text-base-content opacity-70">
								Use the dropdown filters to filter by specific values in Status,
								Category, and Priority columns.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">⏱️ Duration Filter</h3>
							<p className="text-base-content opacity-70">
								Set minimum and maximum duration values to filter tasks by time
								range.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">📊 Sorting</h3>
							<p className="text-base-content opacity-70">
								Click on column headers with arrow icons to sort by Name,
								Duration, or Created Date.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg">📄 Pagination</h3>
							<p className="text-base-content opacity-70">
								Navigate through pages and adjust the number of items displayed
								per page.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
