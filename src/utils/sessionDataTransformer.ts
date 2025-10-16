import { Session } from "../hooks/useSession";
import { DataItem } from "../components/ui/data-table";

interface ServerSession {
	id: string;
	goal: string;
	session_type: string;
	tags: string[] | unknown;
	notes: string | null | undefined;
	planned_duration_minutes: number | null;
	start_time: string;
	expected_end_time: string | null;
	end_time: string | null;
	elapsed_seconds: number;
	status: string;
	completion_type: string | null;
	deep_work_quality: number | string | null;
}

interface TransformedSession {
	id: string;
	goal: string;
	sessionType: string;
	tags: string[];
	notes: string;
	duration: number | null;
	startTime: string;
	expectedEndTime: string | null;
	endTime: string | null;
	elapsedTime: number;
	status: string;
	completionType: string | null;
	deepWorkQuality: number | null;
}

/**
 * Transforms server session data to client format
 */
export const sessionDataTransformer = (
	serverSession: ServerSession
): TransformedSession => {
	return {
		id: serverSession.id,
		goal: serverSession.goal,
		sessionType: serverSession.session_type,
		tags: Array.isArray(serverSession.tags) ? serverSession.tags : [],
		notes: serverSession.notes ?? "",
		duration: serverSession.planned_duration_minutes,
		startTime: serverSession.start_time,
		expectedEndTime: serverSession.expected_end_time,
		endTime: serverSession.end_time,
		elapsedTime: serverSession.elapsed_seconds,
		status: serverSession.status,
		completionType: serverSession.completion_type,
		deepWorkQuality: serverSession.deep_work_quality
			? Number(serverSession.deep_work_quality)
			: null,
	};
};

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
			typeof (session.startTime as unknown)?.toISOString === "function"
				? (session.startTime as Date)
				: new Date(session.startTime as string);
		const sessionDate = start.toISOString().split("T")[0];

		// Get quality rating (default to 5 if not set)
		const quality = session.deepWorkQuality || 5;

		// Get notes (default to empty string if not set)
		const notes = session.notes || "";

		return {
			id: session.id,
			goal: session.goal,
			sessionType,
			duration: durationMinutes,
			quality,
			notes,
			tags: session.tags || [],
			sessionDate,
			status: session.status as string,
		};
	});
};
