import { useState, useEffect, useRef, useCallback } from "react";

export interface Session {
	id: string;
	goal: string;
	startTime: Date;
	duration?: number; // undefined for open sessions
	focusLevel: number;
	tags: string[];
	notes?: string;
	status: "active" | "paused" | "completed" | "stopped";
	elapsedTime: number;
	endTime?: Date;
	sessionType: "planned" | "open";
}

export interface SessionConfig {
	goal: string;
	duration?: number;
	focusLevel: number;
	tags: string[];
	notes?: string;
	sessionType: "planned" | "open";
}

export const useSession = () => {
	const [currentSession, setCurrentSession] = useState<Session | null>(null);
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [remainingTime, setRemainingTime] = useState<number | null>(null);

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<Date | null>(null);
	const pauseTimeRef = useRef<Date | null>(null);
	const totalPausedTimeRef = useRef(0);

	const startSession = useCallback((config: SessionConfig) => {
		const session: Session = {
			id: Date.now().toString(),
			goal: config.goal,
			startTime: new Date(),
			duration: config.duration,
			focusLevel: config.focusLevel,
			tags: config.tags,
			notes: config.notes,
			status: "active",
			elapsedTime: 0,
			sessionType: config.sessionType,
		};

		setCurrentSession(session);
		setIsActive(true);
		setIsPaused(false);
		setElapsedTime(0);
		setRemainingTime(config.duration ? config.duration * 60 : null);
		startTimeRef.current = new Date();
		pauseTimeRef.current = null;
		totalPausedTimeRef.current = 0;

		// Start the timer
		timerRef.current = setInterval(() => {
			setElapsedTime((prev) => {
				const newElapsed = prev + 1;

				// For planned sessions, check if time is up
				if (config.duration && newElapsed >= config.duration * 60) {
					completeSession(session.id);
					return newElapsed;
				}

				return newElapsed;
			});
		}, 1000);
	}, []);

	const pauseSession = useCallback(() => {
		if (!isActive || isPaused) return;

		setIsPaused(true);
		pauseTimeRef.current = new Date();

		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, [isActive, isPaused]);

	const resumeSession = useCallback(() => {
		if (!isActive || !isPaused) return;

		setIsPaused(false);
		if (pauseTimeRef.current) {
			totalPausedTimeRef.current += Date.now() - pauseTimeRef.current.getTime();
			pauseTimeRef.current = null;
		}

		// Restart the timer
		timerRef.current = setInterval(() => {
			setElapsedTime((prev) => {
				const newElapsed = prev + 1;

				// For planned sessions, check if time is up
				if (
					currentSession?.duration &&
					newElapsed >= currentSession.duration * 60
				) {
					completeSession(currentSession.id);
					return newElapsed;
				}

				return newElapsed;
			});
		}, 1000);
	}, [isActive, isPaused, currentSession]);

	const stopSession = useCallback(() => {
		if (!isActive) return;

		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		setIsActive(false);
		setIsPaused(false);
		setElapsedTime(0);
		setRemainingTime(null);

		if (currentSession) {
			const stoppedSession: Session = {
				...currentSession,
				status: "stopped",
				endTime: new Date(),
				elapsedTime,
			};
			setCurrentSession(stoppedSession);
		}
	}, [isActive, currentSession, elapsedTime]);

	const completeSession = useCallback(
		(sessionId: string) => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}

			setIsActive(false);
			setIsPaused(false);

			if (currentSession) {
				const completedSession: Session = {
					...currentSession,
					status: "completed",
					endTime: new Date(),
					elapsedTime,
				};
				setCurrentSession(completedSession);
			}
		},
		[currentSession, elapsedTime]
	);

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

	return {
		// Session state
		currentSession,
		isActive,
		isPaused,
		elapsedTime,
		remainingTime,

		// Session actions
		startSession,
		pauseSession,
		resumeSession,
		stopSession,
		completeSession,

		// Utility functions
		formatTime,
		getProgressPercentage,
	};
};
