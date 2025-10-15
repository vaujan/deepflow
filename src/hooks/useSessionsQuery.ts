"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Session } from "./useSession";

function reviveSession(row: any): Session {
	console.log(
		"[reviveSession] Input row.notes:",
		row.notes,
		"type:",
		typeof row.notes
	);

	const session = {
		id: row.id,
		goal: row.goal,
		startTime: new Date(row.startTime ?? row.start_time),
		duration:
			typeof row.duration === "number"
				? row.duration
				: typeof row.planned_duration_minutes === "number"
				? row.planned_duration_minutes
				: undefined,
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

	console.log("[reviveSession] Output session.notes:", session.notes);
	return session;
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

export function useUpdateSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			id: string;
			payload: Partial<{
				goal: string;
				sessionType: "planned session" | "open session" | "time-boxed" | "open";
				deepWorkQuality: number;
				tags: string[];
				notes: string;
				duration: number; // minutes
				sessionDate: string; // YYYY-MM-DD
			}>;
		}) => {
			console.log("[useUpdateSession] Sending PATCH request:", {
				id: params.id,
				payload: params.payload,
			});

			const requestBody = { action: "edit", ...params.payload };
			console.log("[useUpdateSession] Request body:", requestBody);

			const res = await fetch(`/api/sessions/${params.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});
			const data = await res.json();

			console.log("[useUpdateSession] API response:", {
				ok: res.ok,
				status: res.status,
				data,
			});

			console.log("[useUpdateSession] Raw response data fields:", {
				notes: data.notes,
				tags: data.tags,
				goal: data.goal,
				deepWorkQuality: data.deepWorkQuality,
			});

			if (!res.ok) throw new Error(data?.error || "Failed to update session");
			const revivedSession = reviveSession(data);
			console.log("[useUpdateSession] Revived session:", revivedSession);
			return revivedSession;
		},
		onMutate: async (vars) => {
			// Cancel all outgoing sessions queries
			await queryClient.cancelQueries({ queryKey: ["sessions"] });

			// Snapshot all current sessions queries
			const previousQueries = queryClient.getQueriesData<Session[]>({
				queryKey: ["sessions"],
			});

			// Transform payload to Session format for optimistic update
			const sessionUpdate: Partial<Session> = {};

			if (vars.payload.goal !== undefined)
				sessionUpdate.goal = vars.payload.goal;
			if (vars.payload.deepWorkQuality !== undefined)
				sessionUpdate.deepWorkQuality = vars.payload.deepWorkQuality;
			if (vars.payload.tags !== undefined)
				sessionUpdate.tags = vars.payload.tags;
			if (vars.payload.notes !== undefined)
				sessionUpdate.notes = vars.payload.notes;

			// Map UI sessionType to DB sessionType
			if (vars.payload.sessionType !== undefined) {
				sessionUpdate.sessionType =
					vars.payload.sessionType === "planned session"
						? "time-boxed"
						: vars.payload.sessionType === "open session"
						? "open"
						: (vars.payload.sessionType as "time-boxed" | "open");
			}

			// Convert duration (minutes) to elapsedTime (seconds)
			if (vars.payload.duration !== undefined) {
				sessionUpdate.elapsedTime = Math.floor(vars.payload.duration * 60);
			}

			// Update startTime date if sessionDate provided
			if (vars.payload.sessionDate !== undefined) {
				// This is complex, skip for optimistic update - let server handle it
				// The invalidation will fetch the correct value
			}

			// Optimistically update ALL sessions queries
			queryClient.setQueriesData<Session[]>(
				{ queryKey: ["sessions"] },
				(old) => {
					if (!old) return old;
					return old.map((session) =>
						session.id === vars.id ? { ...session, ...sessionUpdate } : session
					);
				}
			);

			return { previousQueries };
		},
		onError: (err, vars, context) => {
			// Rollback all affected queries
			if (context?.previousQueries) {
				context.previousQueries.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}
		},
		onSettled: (data, error, variables, context) => {
			console.log(
				"[useUpdateSession] onSettled - Invalidating queries. Mutation result:",
				{
					success: !error,
					error: error?.message,
					returnedData: data,
				}
			);
			// Refetch all sessions queries to sync with server
			queryClient.invalidateQueries({ queryKey: ["sessions"] });
		},
	});
}
