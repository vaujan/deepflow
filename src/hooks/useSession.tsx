import { useState, useEffect, useRef, useCallback } from "react";
import { logger } from "../lib/logger";
import { useAuthUser } from "./useAuthUser";

export interface Session {
	id: string;
	goal: string;
	startTime: Date;
	duration?: number; // undefined for open sessions
	tags: string[];
	notes?: string;
	status: "active" | "paused" | "completed" | "stopped";
	elapsedTime: number;
	endTime?: Date;
	sessionType: "time-boxed" | "open" | "pomodoro";
	deepWorkQuality?: number; // 1-10 rating for session quality
	expectedEndTime?: Date; // Calculated expected end time for planned sessions
	completionType?: "completed" | "premature" | "overtime"; // How the session ended
}

export interface SessionConfig {
	goal: string;
	duration?: number;
	tags: string[];
	notes?: string;
	sessionType: "time-boxed" | "open" | "pomodoro";
}

export const useSession = () => {
	const [currentSession, setCurrentSession] = useState<Session | null>(null);
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [remainingTime, setRemainingTime] = useState<number | null>(null);
	const [hasPendingSave, setHasPendingSave] = useState(false);
	const { isGuest } = useAuthUser();

	// Modal states for early stop handling
	const [showEarlyStopModal, setShowEarlyStopModal] = useState(false);
	const [showCompleteFormModal, setShowCompleteFormModal] = useState(false);

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<Date | null>(null);
	const pauseTimeRef = useRef<Date | null>(null);
	const totalPausedTimeRef = useRef(0);
	const sessionIdRef = useRef<string | null>(null);
	// Track latest notes value to avoid stale reads during completion/save
	const notesRef = useRef<string | null>(null);

	const STORAGE_KEY = "df:current-session";

	const toIdempotencyKey = (prefix: string) => {
		try {
			return `${prefix}-${crypto.randomUUID()}`;
		} catch {
			return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		}
	};

	const mapServerSession = (row: Record<string, unknown>): Session => {
		return {
			id: String(row.id),
			goal: String(row.goal),
			startTime: new Date(String(row.startTime ?? row.start_time)),
			duration:
				typeof row.duration === "number"
					? row.duration
					: typeof row.planned_duration_minutes === "number"
					? row.planned_duration_minutes
					: undefined,
			tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
			notes: typeof row.notes === "string" ? row.notes : undefined,
			status: row.status as Session["status"],
			elapsedTime: Number(row.elapsedTime ?? row.elapsed_seconds ?? 0),
			endTime: row.endTime
				? new Date(String(row.endTime))
				: row.end_time
				? new Date(String(row.end_time))
				: undefined,
			sessionType: (row.sessionType ??
				row.session_type) as Session["sessionType"],
			deepWorkQuality:
				typeof row.deepWorkQuality === "number"
					? row.deepWorkQuality
					: typeof row.deep_work_quality === "number"
					? row.deep_work_quality
					: undefined,
			expectedEndTime: row.expectedEndTime
				? new Date(String(row.expectedEndTime))
				: row.expected_end_time
				? new Date(String(row.expected_end_time))
				: undefined,
			completionType: (row.completionType ??
				row.completion_type) as Session["completionType"],
		};
	};

	const saveSnapshot = (payload: {
		id: string;
		status: Session["status"];
		startTime: string;
		expectedEndTime?: string | null;
		needsSave?: boolean;
		// fields used to restore completion screen without server
		elapsedTime?: number;
		endTime?: string | null;
		notes?: string | null;
		deepWorkQuality?: number | null;
		tags?: string[];
	}) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch {}
	};

	const clearSnapshot = () => {
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {}
	};

	const stopSession = useCallback(async () => {
		if (!sessionIdRef.current) return;

		// Check if session is shorter than 5 minutes
		if (elapsedTime < 300) {
			setShowEarlyStopModal(true);
			return;
		}

		// Optimistic UI: stop immediately
		setIsActive(false);
		setIsPaused(false);
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		const res = await fetch(`/api/sessions/${sessionIdRef.current}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Idempotency-Key": toIdempotencyKey("sessions:stop"),
			},
			body: JSON.stringify({ action: "stop" }),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || "Failed to stop");
		const session = mapServerSession(data);
		setCurrentSession(session);
		setElapsedTime(session.elapsedTime ?? 0);
		setRemainingTime(null);
		clearSnapshot();
	}, [elapsedTime]);

	const completeSession = useCallback(
		async (_sessionId: string) => {
			if (!sessionIdRef.current) return;
			// Mark completed locally; defer server save until user confirms
			setIsActive(false);
			setIsPaused(false);
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
			const end = new Date();
			setCurrentSession((prev) =>
				prev
					? {
							...prev,
							status: "completed",
							endTime: end,
							elapsedTime,
					  }
					: prev
			);
			setHasPendingSave(true);
			saveSnapshot({
				id: sessionIdRef.current,
				status: "completed",
				startTime:
					startTimeRef.current?.toISOString() ?? new Date().toISOString(),
				expectedEndTime: currentSession?.expectedEndTime?.toISOString(),
				needsSave: true,
				elapsedTime,
				endTime: end.toISOString(),
				notes: notesRef.current,
				deepWorkQuality: currentSession?.deepWorkQuality ?? null,
				tags: currentSession?.tags ?? [],
			});
		},
		[elapsedTime, currentSession]
	);

	const beginTimer = useCallback(
		(plannedDuration?: number) => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
			timerRef.current = setInterval(() => {
				setElapsedTime((prev) => {
					const isOpen = currentSession?.sessionType === "open";
					const MAX_OPEN_SECONDS = 240 * 60;
					const hardCap = isOpen
						? MAX_OPEN_SECONDS
						: plannedDuration
						? Math.floor(plannedDuration * 60)
						: undefined;
					const next = hardCap ? Math.min(prev + 1, hardCap) : prev + 1;
					if (hardCap && next >= hardCap) {
						if (sessionIdRef.current) {
							if (isOpen) {
								// Auto-stop open session at 4h
								stopSession();
							} else {
								// Auto-complete timeboxed/pomodoro at planned duration
								completeSession(sessionIdRef.current);
							}
						}
						return next;
					}
					return next;
				});
			}, 1000);
		},
		[currentSession?.sessionType, completeSession, stopSession]
	);

	const startSession = useCallback(
		async (config: SessionConfig) => {
			// Create on server
			const payload = {
				goal: config.goal,
				sessionType: config.sessionType,
				tags: config.tags,
				notes: config.notes ?? null,
				duration: config.duration ?? null,
			};

			logger.debug("startSession - Creating session", { payload });

			const res = await fetch("/api/sessions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": toIdempotencyKey("sessions:create"),
				},
				body: JSON.stringify(payload),
			});
			const data = await res.json();

			if (!res.ok) {
				logger.error(
					"startSession - Session creation failed",
					new Error(data?.error || "Unknown error"),
					{
						status: res.status,
						data,
					}
				);
			} else {
				logger.info("startSession - Session created successfully", {
					sessionId: data?.id,
				});
			}

			if (!res.ok) {
				// Provide more specific error messages based on status code
				if (res.status === 401) {
					throw new Error("Please sign in to start a session");
				} else if (res.status === 400) {
					throw new Error(data?.error || "Invalid session configuration");
				} else if (res.status >= 500) {
					throw new Error("Server error. Please try again later");
				} else {
					throw new Error(data?.error || "Failed to start session");
				}
			}

			const session = mapServerSession(data);
			sessionIdRef.current = session.id;
			setCurrentSession(session);
			setIsActive(true);
			setIsPaused(false);
			setElapsedTime(session.elapsedTime ?? 0);
			setRemainingTime(session.duration ? session.duration * 60 : null);
			startTimeRef.current = session.startTime;
			pauseTimeRef.current = null;
			totalPausedTimeRef.current = 0;
			notesRef.current = session.notes ?? null;
			saveSnapshot({
				id: session.id,
				status: session.status,
				startTime: session.startTime.toISOString(),
				expectedEndTime: session.expectedEndTime?.toISOString(),
			});
			beginTimer(session.duration);
		},
		[beginTimer]
	);

	const pauseSession = useCallback(async () => {
		if (!isActive || isPaused || !sessionIdRef.current) return;
		// Optimistic UI: pause immediately
		setIsPaused(true);
		setIsActive(false);
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		const res = await fetch(`/api/sessions/${sessionIdRef.current}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Idempotency-Key": toIdempotencyKey("sessions:pause"),
			},
			body: JSON.stringify({ action: "pause" }),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || "Failed to pause");
		const session = mapServerSession(data);
		setCurrentSession(session);
		setElapsedTime(session.elapsedTime ?? 0);
		notesRef.current = session.notes ?? null;
		saveSnapshot({
			id: session.id,
			status: session.status,
			startTime: session.startTime.toISOString(),
			expectedEndTime: session.expectedEndTime?.toISOString(),
		});
		pauseTimeRef.current = new Date();
	}, [isActive, isPaused]);

	const resumeSession = useCallback(async () => {
		if (isActive || !isPaused || !sessionIdRef.current) return;
		// Optimistic UI: resume immediately
		setIsPaused(false);
		setIsActive(true);
		const res = await fetch(`/api/sessions/${sessionIdRef.current}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Idempotency-Key": toIdempotencyKey("sessions:resume"),
			},
			body: JSON.stringify({ action: "resume" }),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || "Failed to resume");
		const session = mapServerSession(data);
		setCurrentSession(session);
		setElapsedTime(session.elapsedTime ?? 0);
		startTimeRef.current = session.startTime;
		pauseTimeRef.current = null;
		notesRef.current = session.notes ?? null;
		saveSnapshot({
			id: session.id,
			status: session.status,
			startTime: session.startTime.toISOString(),
			expectedEndTime: session.expectedEndTime?.toISOString(),
		});
		beginTimer(session.duration);
	}, [isActive, isPaused, beginTimer]);

	const saveCompletedSession = useCallback(async () => {
		if (
			!sessionIdRef.current ||
			!currentSession ||
			currentSession.status !== "completed"
		)
			return null;

		const payload = {
			action: "complete",
			notes: notesRef.current,
			deepWorkQuality: currentSession.deepWorkQuality ?? null,
			tags: currentSession.tags ?? [],
		};

		logger.debug("saveCompletedSession - Saving session", {
			payload,
			currentNotes: currentSession.notes,
			notesRef: notesRef.current,
			sessionId: currentSession.id,
		});

		const res = await fetch(`/api/sessions/${sessionIdRef.current}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Idempotency-Key": toIdempotencyKey("sessions:complete"),
			},
			body: JSON.stringify(payload),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || "Failed to save session");
		const session = mapServerSession(data);
		setCurrentSession(session);
		setElapsedTime(session.elapsedTime ?? elapsedTime);
		notesRef.current = session.notes ?? null;
		setHasPendingSave(false);
		clearSnapshot();
		return session;
	}, [currentSession, elapsedTime]);

	const dismissSession = useCallback(() => {
		setCurrentSession(null);
		setIsActive(false);
		setIsPaused(false);
		setElapsedTime(0);
		setRemainingTime(null);
		sessionIdRef.current = null;
		clearSnapshot();
	}, []);

	// Calculate remaining time for planned sessions
	useEffect(() => {
		if (currentSession?.duration && isActive && !isPaused) {
			setRemainingTime(Math.max(0, currentSession.duration * 60 - elapsedTime));
		}
	}, [elapsedTime, currentSession?.duration, isActive, isPaused]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	// Hydrate from snapshot on mount and reconcile with server
	useEffect(() => {
		try {
			// Clear any stale session snapshots for guests
			if (isGuest) {
				clearSnapshot();
				return;
			}

			const raw =
				typeof window !== "undefined"
					? localStorage.getItem(STORAGE_KEY)
					: null;
			if (!raw) return;
			const snap = JSON.parse(raw) as {
				id: string;
				status: Session["status"];
				startTime: string;
				expectedEndTime?: string | null;
				needsSave?: boolean;
				elapsedTime?: number;
				endTime?: string | null;
				notes?: string | null;
				deepWorkQuality?: number | null;
				tags?: string[];
			};
			if (!snap?.id) return;
			if (snap.needsSave && snap.status === "completed") {
				// Restore local completion awaiting save; do not reconcile with server
				sessionIdRef.current = snap.id;
				const restored: Session = {
					id: snap.id,
					goal: "",
					startTime: new Date(snap.startTime),
					duration: undefined,
					tags: Array.isArray(snap.tags) ? snap.tags : [],
					notes: snap.notes ?? undefined,
					status: "completed",
					elapsedTime: snap.elapsedTime ?? 0,
					endTime: snap.endTime ? new Date(snap.endTime) : new Date(),
					sessionType: "time-boxed",
					deepWorkQuality: snap.deepWorkQuality ?? undefined,
					expectedEndTime: snap.expectedEndTime
						? new Date(snap.expectedEndTime)
						: undefined,
					completionType: undefined,
				};
				setCurrentSession(restored);
				setIsActive(false);
				setIsPaused(false);
				setElapsedTime(restored.elapsedTime);
				setRemainingTime(restored.duration ? restored.duration * 60 : null);
				notesRef.current = snap.notes ?? null;
				setHasPendingSave(true);
				return;
			}
			(async () => {
				const url = `/api/sessions/${snap.id}`.replace(/\/$/, ""); // Remove trailing slash
				logger.debug("useSession - Fetching session", {
					url,
					sessionId: snap.id,
				});
				const res = await fetch(url);
				const data = await res.json();

				if (!res.ok) {
					logger.warn(
						"useSession - Session not found on server, clearing localStorage",
						{
							status: res.status,
							sessionId: snap.id,
						}
					);
					localStorage.removeItem(STORAGE_KEY);
					// Clear any current session state
					setCurrentSession(null);
					sessionIdRef.current = null;
					setIsActive(false);
					setIsPaused(false);
					setHasPendingSave(false);
					return;
				}
				const session = mapServerSession(data);
				sessionIdRef.current = session.id;
				setCurrentSession(session);
				// Fallback: compute elapsed from startTime if active
				const computedFromStart = Math.max(
					0,
					Math.floor((Date.now() - session.startTime.getTime()) / 1000)
				);
				const effectiveElapsed =
					session.status === "active"
						? Math.max(session.elapsedTime ?? 0, computedFromStart)
						: session.elapsedTime ?? 0;
				setElapsedTime(effectiveElapsed);
				setRemainingTime(session.duration ? session.duration * 60 : null);
				notesRef.current = session.notes ?? null;
				if (session.status === "active") {
					setIsActive(true);
					setIsPaused(false);
					startTimeRef.current = session.startTime;
					beginTimer(session.duration);
				} else if (session.status === "paused") {
					setIsActive(false);
					setIsPaused(true);
				}
			})();
		} catch {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isGuest]);

	// Format time helpers
	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		}
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	};

	const getProgressPercentage = () => {
		if (!currentSession?.duration) return 0;
		return Math.min((elapsedTime / (currentSession.duration * 60)) * 100, 100);
	};

	const updateDeepWorkQuality = useCallback(
		async (_sessionId: string, quality: number) => {
			if (!sessionIdRef.current) return;
			const clamped = Math.max(1, Math.min(10, quality));
			setCurrentSession((prev) =>
				prev ? { ...prev, deepWorkQuality: clamped } : prev
			);
			// If we are awaiting save, keep local only
			if (
				hasPendingSave ||
				(currentSession && currentSession.status === "completed")
			)
				return;
			await fetch(`/api/sessions/${sessionIdRef.current}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": toIdempotencyKey("sessions:updateMeta"),
				},
				body: JSON.stringify({
					action: "updateMeta",
					deepWorkQuality: clamped,
				}),
			});
		},
		[hasPendingSave, currentSession]
	);

	const updateSessionNotes = useCallback(
		async (_sessionId: string, notes: string) => {
			if (!sessionIdRef.current) return;
			logger.debug("updateSessionNotes - Updating notes", {
				notes,
				sessionId: sessionIdRef.current,
			});
			setCurrentSession((prev) => (prev ? { ...prev, notes } : prev));

			// Always update the ref immediately, regardless of pending save state
			notesRef.current = notes;

			// Always save notes to server, even for completed sessions
			// The only time we skip is if there's already a pending save operation
			if (hasPendingSave) {
				logger.debug(
					"updateSessionNotes - Skipping server update - pending save",
					{ sessionId: sessionIdRef.current }
				);
				return;
			}

			const payload = { action: "updateMeta", notes };

			try {
				await fetch(`/api/sessions/${sessionIdRef.current}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						"Idempotency-Key": toIdempotencyKey("sessions:updateMeta"),
					},
					body: JSON.stringify(payload),
				});
				logger.info("updateSessionNotes - Notes saved successfully", {
					sessionId: sessionIdRef.current,
				});
			} catch (error) {
				logger.error(
					"updateSessionNotes - Failed to save notes",
					error as Error,
					{ sessionId: sessionIdRef.current }
				);
			}
		},
		[hasPendingSave]
	);

	const updateSessionMeta = useCallback(
		async (
			sessionId: string,
			meta: { notes?: string; deepWorkQuality?: number; tags?: string[] }
		) => {
			if (!sessionId) return;
			try {
				const res = await fetch(`/api/sessions/${sessionId}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						"Idempotency-Key": toIdempotencyKey("sessions:updateMeta"),
					},
					body: JSON.stringify({
						action: "updateMeta",
						...meta,
					}),
				});
				if (!res.ok) {
					const data = await res.json();
					throw new Error(data?.error || "Failed to update session metadata");
				}
				// Update local state
				setCurrentSession((prev) => (prev ? { ...prev, ...meta } : prev));
			} catch (error) {
				logger.error("Failed to update session metadata", error as Error);
				throw error;
			}
		},
		[]
	);

	// Handle early stop modal interactions
	const handleEarlyStopProceed = useCallback(() => {
		setShowEarlyStopModal(false);
		setShowCompleteFormModal(true);
	}, []);

	const handleEarlyStopCancel = useCallback(() => {
		setShowEarlyStopModal(false);
	}, []);

	const handleCompleteFormClose = useCallback(() => {
		setShowCompleteFormModal(false);
		// Reset session state
		setIsActive(false);
		setIsPaused(false);
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setCurrentSession(null);
		setElapsedTime(0);
		setRemainingTime(null);
		clearSnapshot();
	}, []);

	// Force stop session (bypass 5-minute check)
	const forceStopSession = useCallback(async () => {
		if (!sessionIdRef.current) return;
		// Optimistic UI: stop immediately
		setIsActive(false);
		setIsPaused(false);
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		const res = await fetch(`/api/sessions/${sessionIdRef.current}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Idempotency-Key": toIdempotencyKey("sessions:forceStop"),
			},
			body: JSON.stringify({ action: "stop" }),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || "Failed to stop");
		const session = mapServerSession(data);
		setCurrentSession(session);
		setElapsedTime(session.elapsedTime ?? 0);
		setRemainingTime(null);
		clearSnapshot();
	}, []);

	return {
		// Session state
		currentSession,
		isActive,
		isPaused,
		elapsedTime,
		remainingTime,
		hasPendingSave,

		// Modal states
		showEarlyStopModal,
		showCompleteFormModal,

		// Session actions
		startSession,
		pauseSession,
		resumeSession,
		stopSession,
		completeSession,
		saveCompletedSession,
		dismissSession,
		updateDeepWorkQuality,
		updateSessionNotes,
		updateSessionMeta,

		// Modal handlers
		handleEarlyStopProceed,
		handleEarlyStopCancel,
		handleCompleteFormClose,
		forceStopSession,

		// Utility functions
		formatTime,
		getProgressPercentage,
	};
};
