import { Session } from "../hooks/useSession";

// Generate mock session data for the last 30 days
export const generateMockSessions = (): Session[] => {
	const sessions: Session[] = [];
	const now = new Date();

	// Generate sessions for the last 30 days
	for (let i = 0; i < 30; i++) {
		const date = new Date(now);
		date.setDate(date.getDate() - i);

		// Random number of sessions per day (0-4)
		const sessionsPerDay = Math.floor(Math.random() * 5);

		for (let j = 0; j < sessionsPerDay; j++) {
			const startTime = new Date(date);
			startTime.setHours(8 + Math.floor(Math.random() * 10)); // 8 AM to 6 PM
			startTime.setMinutes(Math.floor(Math.random() * 60));

			const duration = [25, 45, 60, 90, 120][Math.floor(Math.random() * 5)]; // Common durations
			const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

			const goals = [
				"Complete project proposal",
				"Write blog post about productivity",
				"Review and fix bugs in codebase",
				"Study machine learning concepts",
				"Design new user interface",
				"Research market trends",
				"Prepare presentation slides",
				"Code review and refactoring",
				"Learn new programming language",
				"Plan next sprint tasks",
			];

			const tags = [
				["work", "urgent"],
				["blog", "writing"],
				["coding", "debugging"],
				["study", "learning"],
				["design", "ui"],
				["research", "analysis"],
				["presentation", "slides"],
				["review", "refactor"],
				["learning", "programming"],
				["planning", "sprint"],
			];

			const goalIndex = Math.floor(Math.random() * goals.length);
			const sessionType = Math.random() > 0.3 ? "planned" : "open"; // 70% planned, 30% open

			const session: Session = {
				id: `session-${i}-${j}-${Date.now()}`,
				goal: goals[goalIndex],
				startTime,
				duration: sessionType === "planned" ? duration : undefined,
				focusLevel: Math.floor(Math.random() * 10) + 1, // 1-10
				tags: tags[goalIndex],
				notes:
					Math.random() > 0.7
						? "Great focus session, made significant progress"
						: undefined,
				status: "completed",
				elapsedTime: duration * 60, // in seconds
				endTime,
				sessionType: sessionType as "planned" | "open",
				deepWorkQuality: Math.floor(Math.random() * 10) + 1, // 1-10
				expectedEndTime: sessionType === "planned" ? endTime : undefined,
				completionType: Math.random() > 0.1 ? "completed" : "premature", // 90% completed, 10% premature
			};

			sessions.push(session);
		}
	}

	// Sort by start time (most recent first)
	return sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
};

export const mockSessions = generateMockSessions();
