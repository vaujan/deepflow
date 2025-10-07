import { Session } from "../hooks/useSession";
import { DataItem } from "../components/ui/data-table";

/**
 * Transforms Session data to DataItem format for the data table component
 */
export const transformSessionsToDataItems = (
	sessions: Session[]
): DataItem[] => {
	return sessions.map((session) => {
		// Normalize to data-table display values: "planned session" | "open session"
		const sessionType: "planned session" | "open session" =
			session.sessionType === "time-boxed" ? "planned session" : "open session";

		// Convert duration from seconds to minutes
		const durationMinutes = Math.round(session.elapsedTime / 60);

		// Format session date
		const start =
			typeof (session.startTime as any)?.toISOString === "function"
				? (session.startTime as Date)
				: new Date(session.startTime as any);
		const sessionDate = start.toISOString().split("T")[0];

		// Get quality rating (default to 5 if not set)
		const quality = session.deepWorkQuality || 5;

		// Get focus level (default to null if not set)
		const focusLevel = session.focusLevel || null;

		// Get notes (default to empty string if not set)
		const notes = session.notes || "";

		return {
			id: session.id,
			goal: session.goal,
			sessionType,
			duration: durationMinutes,
			focusLevel,
			quality,
			notes,
			tags: session.tags || [],
			sessionDate,
			status: session.status as any,
		};
	});
};
