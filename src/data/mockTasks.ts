export interface Task {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	dueDate?: string;
	project: string;
}

export const mockTasks: Task[] = [
	{
		id: 1,
		title: "📝 Learn how to use the Task Widget",
		description:
			"Click the + button to add new tasks, edit existing ones with the pencil icon, and mark them complete by clicking the circle. Try editing this task to see how it works!",
		completed: false,
		project: "Getting Started",
	},
	{
		id: 2,
		title: "✅ Mark tasks as complete",
		description:
			"Click the circle icon next to any task to mark it as complete. Completed tasks will show with a checkmark and strikethrough text.",
		completed: true,
		project: "Getting Started",
	},
	{
		id: 3,
		title: "📅 Add due dates to tasks",
		description:
			"When creating or editing a task, click the 'Date' button to set a due date. Tasks due today will be highlighted in green.",
		completed: false,
		dueDate: new Date().toISOString().split("T")[0], // Today's date
		project: "Getting Started",
	},
	{
		id: 4,
		title: "✏️ Edit task details",
		description:
			"Hover over any task and click the pencil icon to edit its title, description, or due date. Use Shift+Enter to save or Escape to cancel.",
		completed: false,
		project: "Getting Started",
	},
	{
		id: 5,
		title: "🗑️ Delete unwanted tasks",
		description:
			"Hover over any task and click the trash icon to delete it. This action cannot be undone, so be careful!",
		completed: false,
		project: "Getting Started",
	},
	{
		id: 6,
		title: "🚀 Plan your daily workflow",
		description:
			"Use tasks to organize your daily activities. Break down large projects into smaller, manageable tasks.",
		completed: false,
		dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // Tomorrow
		project: "Work",
	},
	{
		id: 7,
		title: "📋 Review project requirements",
		description:
			"Go through the project documentation and identify all requirements before starting development work.",
		completed: false,
		dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // Day after tomorrow
		project: "Work",
	},
	{
		id: 8,
		title: "💻 Set up development environment",
		description:
			"Install Node.js, VS Code, and configure Git for the new project. Make sure all tools are working properly.",
		completed: false,
		project: "Work",
	},
	{
		id: 9,
		title: "🏃‍♂️ Go for a morning run",
		description:
			"Start the day with a 30-minute run around the neighborhood. Great way to boost energy and focus.",
		completed: false,
		dueDate: new Date().toISOString().split("T")[0], // Today
		project: "Personal",
	},
	{
		id: 10,
		title: "📚 Read for 30 minutes",
		description:
			"Spend time reading a good book or technical articles to expand knowledge and improve focus.",
		completed: false,
		project: "Personal",
	},
	{
		id: 11,
		title: "🛒 Buy groceries for the week",
		description:
			"Make a shopping list and visit the grocery store. Don't forget to check what's already in the pantry.",
		completed: false,
		dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // In 3 days
		project: "Personal",
	},
	{
		id: 12,
		title: "📞 Call family members",
		description:
			"Reach out to parents and siblings to catch up. Schedule a video call if possible.",
		completed: false,
		project: "Personal",
	},
	{
		id: 13,
		title: "🎯 Complete user authentication feature",
		description:
			"Implement login, registration, and password reset functionality with proper validation and security measures.",
		completed: true,
		project: "Development",
	},
	{
		id: 14,
		title: "🧪 Write unit tests for API endpoints",
		description:
			"Create comprehensive test coverage for all API endpoints to ensure reliability and catch bugs early.",
		completed: false,
		dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // Next week
		project: "Development",
	},
	{
		id: 15,
		title: "📖 Update project documentation",
		description:
			"Review and update README, API documentation, and code comments to keep everything current.",
		completed: false,
		project: "Development",
	},
	{
		id: 16,
		title: "🎨 Design new dashboard layout",
		description:
			"Create wireframes and mockups for the new dashboard design. Focus on user experience and accessibility.",
		completed: false,
		dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // In 5 days
		project: "Design",
	},
	{
		id: 17,
		title: "📱 Optimize mobile responsiveness",
		description:
			"Test the application on different screen sizes and fix any layout issues for mobile devices.",
		completed: false,
		project: "Design",
	},
	{
		id: 18,
		title: "🔍 Conduct user research interviews",
		description:
			"Schedule and conduct interviews with 5 potential users to gather feedback on the current design.",
		completed: false,
		project: "Research",
	},
	{
		id: 19,
		title: "📊 Analyze user behavior data",
		description:
			"Review analytics data to understand how users interact with the application and identify improvement opportunities.",
		completed: false,
		project: "Research",
	},
	{
		id: 20,
		title: "🚀 Deploy to staging environment",
		description:
			"Push the latest changes to the staging environment and run integration tests to ensure everything works correctly.",
		completed: false,
		dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // Tomorrow
		project: "DevOps",
	},
];
