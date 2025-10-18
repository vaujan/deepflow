"use client";

import { useState, useEffect, useCallback } from "react";
import { useSessionsQuery } from "./useSessionsQuery";

interface SyncItem {
	id: string;
	name: string;
	type:
		| "note"
		| "session"
		| "task"
		| "bookmark"
		| "calendar"
		| "video"
		| "github"
		| "page";
	status: "synced" | "syncing" | "failed" | "pending";
	lastSync?: Date;
	icon: string; // Icon component name
}

interface SyncStatus {
	items: SyncItem[];
	isOnline: boolean;
	syncedCount: number;
	totalCount: number;
	syncProgress: number;
	lastGlobalSync?: Date;
}

export function useSyncStatus() {
	const [syncItems, setSyncItems] = useState<SyncItem[]>([]);
	const [isOnline, setIsOnline] = useState(true);
	const [lastGlobalSync, setLastGlobalSync] = useState<Date | undefined>();

	// Get sessions data
	const {
		data: sessionsData,
		isLoading: sessionsLoading,
		error: sessionsError,
	} = useSessionsQuery({
		limit: 10,
	});

	// Check online status
	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		setIsOnline(navigator.onLine);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	// Track notes sync status from localStorage
	const getNotesSyncStatus = useCallback(() => {
		if (typeof window === "undefined") return [];

		try {
			const cached = localStorage.getItem("notes-cache");
			const lastSync = localStorage.getItem("notes-last-sync");

			if (cached) {
				const notes = JSON.parse(cached);
				if (Array.isArray(notes) && notes.length > 0) {
					return notes.slice(0, 3).map((note: any, index: number) => ({
						id: `note-${note.id || index}`,
						name: note.title || "Untitled Note",
						type: "note" as const,
						status: lastSync ? ("synced" as const) : ("pending" as const),
						lastSync: lastSync ? new Date(lastSync) : undefined,
						icon: "FileText",
					}));
				}
			}
		} catch (error) {
			console.debug("Error reading notes sync status:", error);
		}

		return [];
	}, []);

	// Track sessions sync status
	const getSessionsSyncStatus = useCallback(() => {
		if (!sessionsData || sessionsLoading) return [];

		return sessionsData.slice(0, 3).map((session: any) => ({
			id: `session-${session.id}`,
			name: session.goal || "Focus Session",
			type: "session" as const,
			status: "synced" as const,
			lastSync: session.startTime ? new Date(session.startTime) : undefined,
			icon: "Timer",
		}));
	}, [sessionsData, sessionsLoading]);

	// Track tasks sync status from localStorage
	const getTasksSyncStatus = useCallback(() => {
		if (typeof window === "undefined") return [];

		try {
			const cached = localStorage.getItem("tasks-cache");
			const lastSync = localStorage.getItem("tasks-last-sync");

			if (cached) {
				const tasks = JSON.parse(cached);
				if (Array.isArray(tasks) && tasks.length > 0) {
					return tasks.slice(0, 2).map((task: any, index: number) => ({
						id: `task-${task.id || index}`,
						name: task.title || "Untitled Task",
						type: "task" as const,
						status: lastSync ? ("synced" as const) : ("pending" as const),
						lastSync: lastSync ? new Date(lastSync) : undefined,
						icon: "CheckSquare",
					}));
				}
			}
		} catch (error) {
			console.debug("Error reading tasks sync status:", error);
		}

		return [];
	}, []);

	// Update sync items when data changes
	useEffect(() => {
		const notesItems = getNotesSyncStatus();
		const sessionsItems = getSessionsSyncStatus();
		const tasksItems = getTasksSyncStatus();

		const allItems = [...notesItems, ...sessionsItems, ...tasksItems];

		setSyncItems(allItems);

		// Update global sync time
		const latestSync = allItems
			.map((item) => item.lastSync)
			.filter(Boolean)
			.sort((a, b) => b!.getTime() - a!.getTime())[0];

		if (latestSync) {
			setLastGlobalSync(latestSync);
		}
	}, [getNotesSyncStatus, getSessionsSyncStatus, getTasksSyncStatus]);

	// Calculate sync statistics
	const syncedCount = syncItems.filter(
		(item) => item.status === "synced"
	).length;
	const totalCount = syncItems.length;
	const syncProgress = totalCount > 0 ? (syncedCount / totalCount) * 100 : 100;

	// Simulate periodic sync updates and status changes
	useEffect(() => {
		const interval = setInterval(() => {
			setSyncItems((prev) =>
				prev.map((item) => {
					const random = Math.random();

					// Occasionally simulate different sync states
					if (random < 0.05 && item.status === "synced") {
						// Simulate syncing state
						return {
							...item,
							status: "syncing" as const,
						};
					} else if (random < 0.08 && item.status === "syncing") {
						// Complete syncing
						return {
							...item,
							status: "synced" as const,
							lastSync: new Date(),
						};
					} else if (random < 0.02 && item.status === "synced") {
						// Simulate occasional failures
						return {
							...item,
							status: "failed" as const,
						};
					} else if (random < 0.03 && item.status === "failed") {
						// Recover from failure
						return {
							...item,
							status: "synced" as const,
							lastSync: new Date(),
						};
					}

					// Occasionally update sync time
					if (random < 0.1 && item.status === "synced") {
						return {
							...item,
							lastSync: new Date(),
						};
					}

					return item;
				})
			);

			// Update global sync time
			setLastGlobalSync(new Date());
		}, 5000); // Update every 5 seconds for more dynamic testing

		return () => clearInterval(interval);
	}, []);

	return {
		items: syncItems,
		isOnline,
		syncedCount,
		totalCount,
		syncProgress,
		lastGlobalSync,
		isLoading: sessionsLoading,
		error: sessionsError,
	};
}
