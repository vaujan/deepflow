import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	Pause,
	Play,
	Clock,
	Hash,
	Goal,
	Square,
	Target,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { Session } from "../../hooks/useSession";
import { toast } from "sonner";

interface ActiveSessionProps {
	session: Session;
	onSessionComplete: (completedSession: Session) => void;
}

export default function ActiveSession({
	session,
	onSessionComplete,
}: ActiveSessionProps) {
	const [elapsedTime, setElapsedTime] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [remainingTime, setRemainingTime] = useState<number | null>(
		session.duration ? session.duration * 60 : null
	);
	const [isTimerExpanded, setIsTimerExpanded] = useState(false);
	const [isTimeVisible, setIsTimeVisible] = useState(true); // Time is shown by default
	// Remove local toast state; using Sonner's global toast instead
	// Confirm end session dialog state
	const [isConfirmingComplete, setIsConfirmingComplete] = useState(false);

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number>(session.startTime.getTime());
	const pauseTimeRef = useRef<number | null>(null);
	const totalPausedTimeRef = useRef(0);
	// Refs for a11y focus management
	const completeButtonRef = useRef<HTMLButtonElement | null>(null);
	const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
	// Refs to access current values in timer
	const sessionRef = useRef(session);
	const onSessionCompleteRef = useRef(onSessionComplete);
	const hasInitializedRef = useRef(false);

	// No long-press: replaced with click + confirm modal

	// Update refs when props change
	useEffect(() => {
		sessionRef.current = session;
		onSessionCompleteRef.current = onSessionComplete;
	}, [session, onSessionComplete]);

	// Handle tab visibility changes
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && !isPaused) {
				// Tab became visible, update timer immediately
				const now = Date.now();
				const newElapsed = Math.floor(
					(now - startTimeRef.current - totalPausedTimeRef.current) / 1000
				);
				setElapsedTime(newElapsed);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [isPaused]);

	// Toggle time visibility
	const toggleTimeVisibility = useCallback(() => {
		setIsTimeVisible((prev) => !prev);
	}, []);

	// Timer logic function to avoid duplication
	const startTimer = useCallback(() => {
		// Clear any existing timer first
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		// Start a new timer that updates every second
		timerRef.current = setInterval(() => {
			const now = Date.now();
			const newElapsed = Math.floor(
				(now - startTimeRef.current - totalPausedTimeRef.current) / 1000
			);

			setElapsedTime(newElapsed);

			// For planned sessions, check if time is up
			if (
				sessionRef.current.duration &&
				newElapsed >= sessionRef.current.duration * 60
			) {
				// Clear timer
				if (timerRef.current) {
					clearInterval(timerRef.current);
					timerRef.current = null;
				}

				// Play completion sound
				playSound(800, 0.3, 0.5);

				// Create completed session object
				const endTime = new Date();
				let completionType: "completed" | "premature" | "overtime" =
					"completed";

				// Determine completion type for planned sessions
				if (sessionRef.current.duration && sessionRef.current.expectedEndTime) {
					const expectedEnd = sessionRef.current.expectedEndTime.getTime();
					const actualEnd = endTime.getTime();
					const timeDiff = actualEnd - expectedEnd;
					const toleranceMs = 60000; // 1 minute tolerance

					if (timeDiff < -toleranceMs) {
						completionType = "premature";
					} else if (timeDiff > toleranceMs) {
						completionType = "overtime";
					} else {
						completionType = "completed";
					}
				}

				const completedSession = {
					...sessionRef.current,
					status: "completed" as const,
					endTime: endTime,
					elapsedTime: newElapsed,
					completionType,
				};

				onSessionCompleteRef.current(completedSession);
			}
		}, 1000);
	}, []);

	// Start timer immediately when component mounts (if not paused)
	useEffect(() => {
		if (!isPaused && !hasInitializedRef.current) {
			startTimer();
			hasInitializedRef.current = true;
		}
	}, [isPaused, startTimer]);

	// Handle timer start/stop based on pause state
	useEffect(() => {
		if (isPaused) {
			// Clear timer when paused
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		} else if (hasInitializedRef.current) {
			// Start timer when resumed (only if already initialized)
			startTimer();
		}
	}, [isPaused]); // Only depend on isPaused

	// Cleanup timers on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	const handlePauseResume = useCallback(() => {
		if (isPaused) {
			resumeSession();
		} else {
			pauseSession();
		}
	}, [isPaused]);

	const pauseSession = () => {
		setIsPaused(true);
		pauseTimeRef.current = Date.now();

		// Play pause sound
		playSound(400, 0.2, 0.3);

		// Show toast notification (Sonner)
		toast.warning("Session paused");

		// Timer will be cleared by the useEffect
	};

	const resumeSession = () => {
		setIsPaused(false);
		if (pauseTimeRef.current) {
			totalPausedTimeRef.current += Date.now() - pauseTimeRef.current;
			pauseTimeRef.current = null;
		}

		// Play resume sound
		playSound(600, 0.2, 0.3);

		// Show toast notification (Sonner)
		toast.info("Session resumed");

		// Timer will be started by the useEffect
	};

	// Calculate remaining time for planned sessions
	useEffect(() => {
		if (session.duration && !isPaused) {
			setRemainingTime(Math.max(0, session.duration * 60 - elapsedTime));
		}
	}, [elapsedTime, session.duration, isPaused]);

	// Remove the keyboard shortcuts useEffect entirely
	// useEffect(() => {
	// 	const handleKeyDown = (e: KeyboardEvent) => {
	// 		if (e.code === "Space" && !e.repeat) {
	// 			e.preventDefault();
	// 			handlePauseResume();
	// 		}
	// 		if (e.code === "KeyT" && !e.repeat) {
	// 			e.preventDefault();
	// 			toggleTimeVisibility();
	// 		}
	// 	};

	// 	window.addEventListener("keydown", handleKeyDown);
	// 	return () => window.removeEventListener("keydown", handleKeyDown);
	// }, [handlePauseResume, toggleTimeVisibility]);

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
		if (!session.duration) return 0;
		return Math.min((elapsedTime / (session.duration * 60)) * 100, 100);
	};

	// Helper function to play sounds
	const playSound = (frequency: number, volume: number, duration: number) => {
		try {
			const audioContext = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
			gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				audioContext.currentTime + duration
			);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + duration);
		} catch (error) {
			// Fallback if audio is not supported
			console.log("Sound effect not supported");
		}
	};

	// Open/close confirm dialog and confirm completion
	const openCompleteConfirm = () => {
		setIsConfirmingComplete(true);
		// Move focus into the dialog for a11y
		setTimeout(() => {
			if (confirmButtonRef.current) confirmButtonRef.current.focus();
		}, 0);
	};

	const closeCompleteConfirm = () => {
		setIsConfirmingComplete(false);
		// Return focus to the trigger button
		setTimeout(() => {
			if (completeButtonRef.current) completeButtonRef.current.focus();
		}, 0);
	};

	const confirmComplete = () => {
		// Clear running timer
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		// Play completion sound
		playSound(800, 0.3, 0.5);

		// Create completed session object
		const endTime = new Date();
		let completionType: "completed" | "premature" | "overtime" = "completed";

		// Determine completion type for planned sessions
		if (session.duration && session.expectedEndTime) {
			const expectedEnd = session.expectedEndTime.getTime();
			const actualEnd = endTime.getTime();
			const timeDiff = actualEnd - expectedEnd;
			const toleranceMs = 60000; // 1 minute tolerance

			if (timeDiff < -toleranceMs) {
				completionType = "premature";
			} else if (timeDiff > toleranceMs) {
				completionType = "overtime";
			} else {
				completionType = "completed";
			}
		}

		const completedSession = {
			...session,
			status: "completed" as const,
			endTime: endTime,
			elapsedTime,
			completionType,
		};

		onSessionComplete(completedSession);
		closeCompleteConfirm();
	};

	const progressPercentage = getProgressPercentage();
	const isPlannedSession = session.sessionType !== "open";

	// Helper function to truncate extremely long goals for display
	const truncateGoal = (goal: string, maxLength: number = 100) => {
		if (goal.length <= maxLength) return goal;
		return goal.substring(0, maxLength) + "...";
	};

	const handleTimerClick = () => {
		setIsTimerExpanded(!isTimerExpanded);
	};

	return (
		<>
			{/* Toast Notification removed - using Sonner's global Toaster */}

			<div className="card bg-transparent min-w-lg w-full xl:max-w-lg p-4 lg:p-6 gap-4 lg:gap-6 overflow-hidden">
				{/* Session Header */}
				<div className="flex flex-col text-center">
					<h1
						className="font-semibold text-lg break-words"
						style={{
							wordWrap: "break-word",
							overflowWrap: "break-word",
							whiteSpace: "pre-wrap",
						}}
					>
						{truncateGoal(session.goal, 80)}
					</h1>
					<p className="text-base-content/70 text-sm">
						{session.sessionType === "time-boxed"
							? "Time-boxed focus session"
							: session.sessionType === "pomodoro"
							? "Pomodoro focus session"
							: "Flow-based session"}
					</p>
				</div>

				{/* Timer Display */}
				<div
					className={`text-center border border-border bg-card z-10 group flex flex-col rounded-box gap-8 p-8 cursor-pointer transition-all duration-300 ease-out transform ${
						isTimerExpanded ? "bg-base-200" : "bg-card scale-100"
					}`}
					onClick={handleTimerClick}
					title="Click to show/hide session details"
				>
					{isTimeVisible ? (
						<>
							{isPlannedSession ? (
								<div className="space-y-2">
									<div className="text-4xl text-base-content font-mono">
										{remainingTime ? formatTime(remainingTime) : "00:00"}
									</div>
									<p className="text-sm text-base-content/60">
										{isPaused ? "Paused" : "Remaining"}
									</p>
								</div>
							) : (
								<div className="space-y-2">
									<div className="text-4xl font-medium text-base-content font-mono">
										{formatTime(elapsedTime)}
									</div>
									<p className="text-sm text-base-content/60">
										{isPaused ? "Paused" : "Elapsed time"}
									</p>
								</div>
							)}
						</>
					) : (
						<div className="space-y-2">
							<p className="text-sm text-base-content/60">
								{isPaused ? "Paused" : " "}
							</p>
							{/* Show simple message for non-planned sessions when time is hidden */}
							{/* Show "Session is running..." only for flow-based sessions when time is hidden */}
							{!isPlannedSession && (
								<p className="text-sm text-base-content/60">
									{isPaused ? null : "Session is running..."}
								</p>
							)}
						</div>
					)}

					{isPlannedSession && (
						<div className="space-y-3">
							{isTimeVisible && (
								<div className="flex justify-between text-sm invisible transition-all group-hover:visible">
									<span className="text-base-content/70 font-medium">
										Progress
									</span>
									<span className="text-base-content font-medium">
										{Math.round(progressPercentage)}%
									</span>
								</div>
							)}

							{/* Enhanced Progress Bar */}
							<div className="relative">
								{/* Background track */}
								<div className="w-full flex align-middle items-center h-2 bg-base-300">
									{/* Progress fill with gradient */}
									<div
										className="h-4 bg-base-content transition-all ease-out relative "
										style={{ width: `${progressPercentage}%` }}
									></div>
								</div>
							</div>
						</div>
					)}

					{/* Chevron indicator */}
					<div className="flex invisible group-hover:visible justify-center">
						{isTimerExpanded ? (
							<ChevronUp className="size-4 text-base-content/50 transition-all duration-300 ease-out transform rotate-0" />
						) : (
							<ChevronDown className="size-4 text-base-content/50 transition-all duration-300 ease-out transform rotate-0" />
						)}
					</div>
				</div>

				{/* Progress Bar for Planned Sessions */}

				{/* Session Info */}
				<div
					className={`flex flex-col gap-4 text-sm bg-base-200/50 card rounded-box p-6 overflow-hidden transition-all duration-300 ease-out ${
						isTimerExpanded
							? "max-h-96 opacity-100 -mt-14 pt-14"
							: "max-h-0 opacity-0 p-0 mt-0"
					}`}
				>
					{/* Goal */}
					<div className="flex flex-1 items-start gap-2">
						<Goal className="size-4 text-base-content/50 mt-0.5 flex-shrink-0" />
						<div className="flex-1 flex flex-col gap-1">
							<span className="text-base-content/70 text-sm">Goal:</span>
							<span
								className="text-base-content font-medium leading-relaxed break-words"
								style={{
									wordWrap: "break-word",
									overflowWrap: "break-word",
									whiteSpace: "pre-wrap",
								}}
							>
								{truncateGoal(session.goal, 120) || "No goal set"}
							</span>
						</div>
					</div>

					{/* Started time */}
					{isTimeVisible && (
						<div className="flex align-middle items-center gap-2">
							<Clock className="size-4 text-base-content/50" />
							<span className="text-base-content/70">Started:</span>
							<span>{session.startTime.toLocaleTimeString()}</span>
						</div>
					)}

					{/* End time */}
					{isTimeVisible && (
						<div className="flex align-middle items-center gap-2">
							<Clock className="size-4 text-base-content/50" />
							<span className="text-base-content/50">Ends at:</span>
							<span>
								{isPlannedSession && session.duration
									? new Date(
											session.startTime.getTime() + session.duration * 60 * 1000
									  ).toLocaleTimeString()
									: "-"}
							</span>
						</div>
					)}

					{/* Focus level */}
					{/* <div className="flex align-middle items-center gap-2">
						<Target className="size-4 text-base-content/50" />
						<span className="text-base-content/70">Focus Level</span>
						<span>{session.focusLevel}</span>
					</div> */}

					{/* Tags */}
					{session.tags.length > 0 && (
						<div className="flex items-start gap-2">
							<Hash className="size-4 text-base-content/50 mt-0.5 flex-shrink-0" />
							<div className="flex flex-wrap gap-2">
								{session.tags.map((tag, index) => (
									<span key={index} className="badge rounded-sm badge-sm">
										#{tag}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Session Controls */}
				<div className="flex gap-3 w-full">
					{/* End session button triggers confirm dialog */}
					<button
						onClick={openCompleteConfirm}
						ref={completeButtonRef}
						className="btn btn-lg btn-ghost"
						title="End and complete this session"
						aria-label="End and complete this session"
						aria-describedby="complete-button-description"
						style={{ touchAction: "manipulation" }}
					>
						<Square className="size-5" />
					</button>

					{/* Pause/Resume Button */}
					<button
						onClick={handlePauseResume}
						className={`btn btn-lg flex-1 ${isPaused ? "btn-primary" : ""}`}
						title={
							isPaused ? "Resume the focus session" : "Pause the focus session"
						}
						aria-label={isPaused ? "Resume session" : "Pause session"}
						aria-describedby="pause-button-description"
					>
						{isPaused ? (
							<Play className="size-5" />
						) : (
							<Pause className="size-5" />
						)}
					</button>
				</div>

				{/* Accessibility descriptions */}
				<div className="sr-only">
					<div id="complete-button-description">
						End and complete the current focus session.
					</div>
					<div id="pause-button-description">
						{isPaused
							? "Click to resume the paused focus session."
							: "Click to pause the active focus session."}
					</div>
					<div id="time-visibility-description">
						Toggle time display visibility.
					</div>
				</div>

				{/* Remove the Keyboard Shortcuts Hint section entirely */}
				{/* <div className="text-center w-full justify-center flex gap-4 text-xs text-base-content/50 space-y-1">
					<p>Space: Pause/Resume</p>
					<p>/</p>
					<p>T: {isTimeVisible ? "Hide" : "Show"} Time</p>
				</div> */}

				{/* Time Visibility Toggle Button */}
				<div className="text-center w-full justify-center">
					<button
						onClick={toggleTimeVisibility}
						className="btn btn-xs btn-ghost hover:opacity-100 opacity-25"
						title={isTimeVisible ? "Hide time display" : "Show time display"}
						aria-label={isTimeVisible ? "Hide time" : "Show time"}
						style={{ touchAction: "manipulation" }}
					>
						{isTimeVisible ? "Hide Time" : "Show Time"}
					</button>
				</div>

				{/* Session Status */}
				{/* <div className="text-center">
					<div
						className={`badge badge-lg ${
							isPaused ? "badge-warning" : "badge-success"
						}`}
					>
						{isPaused ? "PAUSED" : "ACTIVE"}
					</div>
				</div> */}
			</div>
			{/* Confirm End Session Dialog */}
			{isConfirmingComplete && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					role="dialog"
					aria-modal="true"
					aria-labelledby="end-session-title"
					onKeyDown={(e) => {
						if (e.key === "Escape") closeCompleteConfirm();
					}}
				>
					<div className="card bg-base-100 p-6 w-full max-w-sm rounded-box shadow-xl">
						<h2 id="end-session-title" className="font-semibold mb-2">
							End session?
						</h2>
						<p className="text-sm text-base-content/70 mb-4">
							This will stop the timer and mark the session as complete.
						</p>
						<div className="flex gap-2 justify-end">
							<button
								className="btn btn-ghost"
								onClick={closeCompleteConfirm}
								style={{ touchAction: "manipulation" }}
							>
								Cancel
							</button>
							<button
								ref={confirmButtonRef}
								className="btn btn-error"
								onClick={confirmComplete}
								style={{ touchAction: "manipulation" }}
							>
								End session
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
