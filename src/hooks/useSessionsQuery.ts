"use client";

import { useQuery } from "@tanstack/react-query";
import type { Session } from "./useSession";

function reviveSession(row: any): Session {
	return {
		id: row.id,
		goal: row.goal,
		startTime: new Date(row.startTime ?? row.start_time),
		duration:
			typeof row.duration === "number"
				? row.duration
				: typeof row.planned_duration_minutes === "number"
				? row.planned_duration_minutes
				: undefined,
		focusLevel: row.focusLevel ?? row.focus_level,
		tags: Array.isArray(row.tags) ? row.tags : [],
		notes: row.notes ?? undefined,
		status: row.status,
		elapsedTime: row.elapsedTime ?? row.elapsed_seconds ?? 0,
		endTime: row.endTime
			? new Date(row.endTime)
			: row.end_time
			? new Date(row.end_time)
			: undefined,
		sessionType: row.sessionType ?? row.session_type,
		deepWorkQuality: row.deepWorkQuality ?? row.deep_work_quality ?? undefined,
		expectedEndTime: row.expectedEndTime
			? new Date(row.expectedEndTime)
			: row.expected_end_time
			? new Date(row.expected_end_time)
			: undefined,
		completionType: row.completionType ?? row.completion_type ?? undefined,
	};
}

export function useSessionsQuery(params?: {
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
}) {
	const search = new URLSearchParams();
	if (params?.from) search.set("from", params.from);
	if (params?.to) search.set("to", params.to);
	if (typeof params?.limit === "number")
		search.set("limit", String(params.limit));
	if (typeof params?.offset === "number")
		search.set("offset", String(params.offset));
	const key = [
		"sessions",
		params?.from ?? null,
		params?.to ?? null,
		params?.limit ?? null,
		params?.offset ?? null,
	];

	return useQuery({
		queryKey: key,
		queryFn: async () => {
			const url =
				"/api/sessions" + (search.toString() ? `?${search.toString()}` : "");
			const res = await fetch(url);
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Failed to load sessions");
			return (data as any[]).map(reviveSession);
		},
	});
}
