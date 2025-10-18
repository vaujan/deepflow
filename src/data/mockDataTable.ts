// Mock data for the data table component
export type DataItem = {
	id: string;
	goal: string;
	sessionType: "planned session" | "open session";
	duration: number; // in minutes
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

// Generate recent dates for the last 30 days
const getRecentDate = (daysAgo: number): string => {
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	return date.toISOString().split("T")[0];
};

// Sample data for the data table
export const mockDataTableData: DataItem[] = [
	{
		id: "1",
		goal: "Complete API integration for user authentication",
		sessionType: "planned session",
		duration: 150,
		quality: 9,
		notes:
			"Had some interruptions but managed to complete the core functionality. The JWT implementation is working well and integration tests are passing.",
		tags: ["coding", "api", "backend", "authentication"],
		sessionDate: getRecentDate(1),
	},
	{
		id: "2",
		goal: "Draft comprehensive blog post outline",
		sessionType: "open session",
		duration: 105,
		quality: 8,
		notes:
			"Good flow; outline is comprehensive. Need to research more statistics for the productivity section.",
		tags: ["writing", "content", "blog"],
		sessionDate: getRecentDate(2),
	},
	{
		id: "3",
		goal: "Redesign landing page with modern UI",
		sessionType: "planned session",
		duration: 195,
		quality: 10,
		notes:
			"Excellent focus; design came together beautifully. The new color scheme and typography really improved the overall feel.",
		tags: ["design", "ui", "frontend", "landing-page"],
		sessionDate: getRecentDate(3),
	},
	{
		id: "4",
		goal: "Study React Server Components",
		sessionType: "planned session",
		duration: 90,
		quality: 8,
		notes:
			"Focused study session on RSC patterns. The documentation was clear and examples were helpful. Need to practice implementation.",
		tags: ["learning", "react", "study", "frontend"],
		sessionDate: getRecentDate(4),
	},
	{
		id: "5",
		goal: "Code review and refactoring",
		sessionType: "open session",
		duration: 120,
		quality: 7,
		notes:
			"Reviewed several PRs and refactored some legacy code. Found some performance issues that need addressing.",
		tags: ["code-review", "refactoring", "performance"],
		sessionDate: getRecentDate(5),
	},
	{
		id: "6",
		goal: "Plan next sprint tasks and priorities",
		sessionType: "planned session",
		duration: 60,
		quality: 9,
		notes:
			"Productive planning session. Prioritized features based on user feedback and technical debt. Clear roadmap for next 2 weeks.",
		tags: ["planning", "sprint", "productivity"],
		sessionDate: getRecentDate(6),
	},
	{
		id: "7",
		goal: "Debug performance issues in dashboard",
		sessionType: "open session",
		duration: 180,
		quality: 8,
		notes:
			"Deep debugging session. Found the bottleneck was in the data fetching logic. Optimized queries and added caching.",
		tags: ["debugging", "performance", "dashboard", "optimization"],
		sessionDate: getRecentDate(7),
	},
	{
		id: "8",
		goal: "Write technical documentation",
		sessionType: "planned session",
		duration: 75,
		quality: 8,
		notes:
			"Documented the new API endpoints and authentication flow. Added code examples and troubleshooting guides.",
		tags: ["documentation", "writing", "api"],
		sessionDate: getRecentDate(8),
	},
	{
		id: "9",
		goal: "Learn TypeScript advanced patterns",
		sessionType: "open session",
		duration: 135,
		quality: 9,
		notes:
			"Great learning session on generics and utility types. The examples were clear and I feel more confident with complex types.",
		tags: ["learning", "typescript", "study", "programming"],
		sessionDate: getRecentDate(9),
	},
	{
		id: "10",
		goal: "Design user onboarding flow",
		sessionType: "planned session",
		duration: 165,
		quality: 9,
		notes:
			"Creative session focused on UX. Created wireframes and user journey maps. The flow feels intuitive and engaging.",
		tags: ["design", "ux", "onboarding", "wireframes"],
		sessionDate: getRecentDate(10),
	},
	{
		id: "11",
		goal: "Fix critical security vulnerability",
		sessionType: "open session",
		duration: 240,
		quality: 10,
		notes:
			"Urgent security fix. Identified and patched SQL injection vulnerability. Updated all related code and added security tests.",
		tags: ["security", "urgent", "bug-fix", "database"],
		sessionDate: getRecentDate(11),
	},
	{
		id: "12",
		goal: "Research new database optimization techniques",
		sessionType: "open session",
		duration: 90,
		quality: 8,
		notes:
			"Research session on database indexing and query optimization. Found some interesting techniques to implement.",
		tags: ["research", "database", "optimization", "learning"],
		sessionDate: getRecentDate(12),
	},
	{
		id: "13",
		goal: "Implement automated testing suite",
		sessionType: "planned session",
		duration: 180,
		quality: 9,
		notes:
			"Set up comprehensive test suite with Jest and Cypress. Added unit tests, integration tests, and E2E tests. Coverage is now at 85%.",
		tags: ["testing", "automation", "jest", "cypress"],
		sessionDate: getRecentDate(13),
	},
	{
		id: "14",
		goal: "Create data visualization dashboard",
		sessionType: "open session",
		duration: 210,
		quality: 9,
		notes:
			"Built interactive dashboard with D3.js and React. The charts are responsive and the data insights are clear.",
		tags: ["data-viz", "dashboard", "d3", "react", "analytics"],
		sessionDate: getRecentDate(14),
	},
	{
		id: "15",
		goal: "Study system design patterns",
		sessionType: "planned session",
		duration: 120,
		quality: 8,
		notes:
			"Focused study on microservices architecture and distributed systems. The case studies were very insightful.",
		tags: ["learning", "system-design", "architecture", "study"],
		sessionDate: getRecentDate(15),
	},
	{
		id: "16",
		goal: "Optimize mobile app performance",
		sessionType: "open session",
		duration: 150,
		quality: 8,
		notes:
			"Performance optimization session. Reduced bundle size by 30% and improved load times significantly.",
		tags: ["mobile", "performance", "optimization", "react-native"],
		sessionDate: getRecentDate(16),
	},
	{
		id: "17",
		goal: "Write project proposal",
		sessionType: "planned session",
		duration: 135,
		quality: 7,
		notes:
			"Drafted comprehensive project proposal. Need to review and refine the technical specifications section.",
		tags: ["writing", "proposal", "planning", "documentation"],
		sessionDate: getRecentDate(17),
	},
	{
		id: "18",
		goal: "Learn GraphQL best practices",
		sessionType: "open session",
		duration: 105,
		quality: 9,
		notes:
			"Excellent learning session on GraphQL schema design and query optimization. The examples were practical and well-explained.",
		tags: ["learning", "graphql", "api", "study"],
		sessionDate: getRecentDate(18),
	},
	{
		id: "19",
		goal: "Design component library",
		sessionType: "planned session",
		duration: 195,
		quality: 10,
		notes:
			"Created comprehensive design system with reusable components. The consistency and accessibility features are solid.",
		tags: ["design", "components", "ui", "design-system"],
		sessionDate: getRecentDate(19),
	},
	{
		id: "20",
		goal: "Implement real-time notifications",
		sessionType: "open session",
		duration: 165,
		quality: 8,
		notes:
			"Built WebSocket-based notification system. The real-time updates are working smoothly across different browsers.",
		tags: ["websockets", "real-time", "notifications", "backend"],
		sessionDate: getRecentDate(20),
	},
	{
		id: "21",
		goal: "Study machine learning fundamentals",
		sessionType: "planned session",
		duration: 90,
		quality: 8,
		notes:
			"Introduction to ML concepts and algorithms. The mathematical foundations are challenging but interesting.",
		tags: ["learning", "machine-learning", "ai", "study"],
		sessionDate: getRecentDate(21),
	},
	{
		id: "22",
		goal: "Refactor legacy authentication code",
		sessionType: "open session",
		duration: 180,
		quality: 7,
		notes:
			"Complex refactoring session. The legacy code was tightly coupled but managed to improve maintainability.",
		tags: ["refactoring", "legacy", "authentication", "maintenance"],
		sessionDate: getRecentDate(22),
	},
	{
		id: "23",
		goal: "Create user feedback system",
		sessionType: "planned session",
		duration: 120,
		quality: 9,
		notes:
			"Designed and implemented feedback collection system. The UI is intuitive and the data collection is comprehensive.",
		tags: ["feedback", "ui", "data-collection", "user-experience"],
		sessionDate: getRecentDate(23),
	},
	{
		id: "24",
		goal: "Learn Docker containerization",
		sessionType: "open session",
		duration: 150,
		quality: 9,
		notes:
			"Hands-on learning session with Docker. Successfully containerized the application and set up multi-stage builds.",
		tags: ["learning", "docker", "devops", "containerization"],
		sessionDate: getRecentDate(24),
	},
	{
		id: "25",
		goal: "Optimize database queries",
		sessionType: "planned session",
		duration: 135,
		quality: 9,
		notes:
			"Database optimization session. Added proper indexes and rewrote slow queries. Performance improved by 60%.",
		tags: ["database", "optimization", "performance", "sql"],
		sessionDate: getRecentDate(25),
	},
	{
		id: "26",
		goal: "Design mobile app wireframes",
		sessionType: "open session",
		duration: 165,
		quality: 8,
		notes:
			"Mobile-first design session. Created responsive wireframes that work well across different screen sizes.",
		tags: ["design", "mobile", "wireframes", "responsive"],
		sessionDate: getRecentDate(26),
	},
	{
		id: "27",
		goal: "Study cybersecurity best practices",
		sessionType: "planned session",
		duration: 105,
		quality: 8,
		notes:
			"Security awareness session. Learned about common vulnerabilities and how to prevent them in web applications.",
		tags: ["learning", "security", "cybersecurity", "study"],
		sessionDate: getRecentDate(27),
	},
	{
		id: "28",
		goal: "Implement caching strategy",
		sessionType: "open session",
		duration: 120,
		quality: 8,
		notes:
			"Added Redis caching to improve API response times. The cache invalidation strategy is working well.",
		tags: ["caching", "redis", "performance", "backend"],
		sessionDate: getRecentDate(28),
	},
	{
		id: "29",
		goal: "Write technical blog post",
		sessionType: "planned session",
		duration: 180,
		quality: 8,
		notes:
			"Comprehensive blog post about modern web development practices. Included code examples and best practices.",
		tags: ["writing", "blog", "technical", "web-development"],
		sessionDate: getRecentDate(29),
	},
	{
		id: "30",
		goal: "Learn advanced CSS techniques",
		sessionType: "open session",
		duration: 90,
		quality: 9,
		notes:
			"Explored CSS Grid, Flexbox, and modern layout techniques. The responsive designs are much cleaner now.",
		tags: ["learning", "css", "frontend", "styling"],
		sessionDate: getRecentDate(30),
	},
];
