"use client";

import { useEffect, useMemo } from "react";
import { useSessionsQuery } from "@/src/hooks/useSessionsQuery";
import { useSession } from "@/src/hooks/useSession";

export function useStatsSessions(opts?: {
	from?: string;
	to?: string;
	limit?: number;
}) {
	const { isActive, hasPendingSave } = useSession();
	const query = useSessionsQuery({
		from: opts?.from,
		to: opts?.to,
		limit: opts?.limit,
	});

	// Only include saved sessions (exclude active/paused)
	const data = useMemo(
		() =>
			(query.data ?? []).filter(
				(s) => s.status !== "active" && s.status !== "paused"
			),
		[query.data]
	);

	// Gentle refetch while a timer is running or a save is pending
	useEffect(() => {
		if (!isActive && !hasPendingSave) return;
		const id = setInterval(() => {
			query.refetch();
		}, 15000);
		return () => clearInterval(id);
	}, [isActive, hasPendingSave, query.refetch]);

	return { ...query, data } as typeof query & { data: typeof data };
}
