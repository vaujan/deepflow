import React, { useState, useEffect, useRef, useCallback } from "react";
import { Pause, Play, Clock, Hash, Goal, Square, Target } from "lucide-react";
import { Session } from "../../hooks/useSession";
import Toast from "./toast";

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
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "info" | "warning" | "error";
		isVisible: boolean;
	} | null>(null);
	// Hold-to-confirm state for complete button
	const [isHoldingComplete, setIsHoldingComplete] = useState(false);
	const [holdProgress, setHoldProgress] = useState(0);

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number>(session.startTime.getTime());
	const pauseTimeRef = useRef<number | null>(null);
	const totalPausedTimeRef = useRef(0);
	// Hold-to-confirm refs for complete button
	const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
	const holdProgressRef = useRef<NodeJS.Timeout | null>(null);
	// Refs to access current values in timer
	const sessionRef = useRef(session);
	const onSessionCompleteRef = useRef(onSessionComplete);
	const hasInitializedRef = useRef(false);

	// Hold duration constants for complete button
	const HOLD_DURATION = 1500; // 1.5 seconds in milliseconds
	const PROGRESS_UPDATE_INTERVAL = 16; // ~60fps for smooth progress bar

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

	// Start timer immediately when component mounts (if not paused)
	useEffect(() => {
		if (!isPaused && !hasInitializedRef.current) {
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

					// Play completion sound (if available)
					try {
						// Create a simple beep sound using Web Audio API
						const audioContext = new (window.AudioContext ||
							(window as any).webkitAudioContext)();
						const oscillator = audioContext.createOscillator();
						const gainNode = audioContext.createGain();

						oscillator.connect(gainNode);
						gainNode.connect(audioContext.destination);

						oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
						gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
						gainNode.gain.exponentialRampToValueAtTime(
							0.01,
							audioContext.currentTime + 0.5
						);

						oscillator.start(audioContext.currentTime);
						oscillator.stop(audioContext.currentTime + 0.5);
					} catch (error) {
						// Fallback if audio is not supported
						console.log("Session completed!");
					}

					// Create completed session object
					const completedSession = {
						...sessionRef.current,
						status: "completed" as const,
						endTime: new Date(),
						elapsedTime: newElapsed,
					};

					onSessionCompleteRef.current(completedSession);
				}
			}, 1000);

			hasInitializedRef.current = true;
		}
	}, [isPaused]); // Only depend on isPaused

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

					// Play completion sound (if available)
					try {
						// Create a simple beep sound using Web Audio API
						const audioContext = new (window.AudioContext ||
							(window as any).webkitAudioContext)();
						const oscillator = audioContext.createOscillator();
						const gainNode = audioContext.createGain();

						oscillator.connect(gainNode);
						gainNode.connect(audioContext.destination);

						oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
						gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
						gainNode.gain.exponentialRampToValueAtTime(
							0.01,
							audioContext.currentTime + 0.5
						);

						oscillator.start(audioContext.currentTime);
						oscillator.stop(audioContext.currentTime + 0.5);
					} catch (error) {
						// Fallback if audio is not supported
						console.log("Session completed!");
					}

					// Create completed session object
					const completedSession = {
						...sessionRef.current,
						status: "completed" as const,
						endTime: new Date(),
						elapsedTime: newElapsed,
					};

					onSessionCompleteRef.current(completedSession);
				}
			}, 1000);
		}
	}, [isPaused]); // Only depend on isPaused

	// Cleanup timers on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
			// Cleanup hold timers
			if (holdTimerRef.current) {
				clearTimeout(holdTimerRef.current);
			}
			if (holdProgressRef.current) {
				clearInterval(holdProgressRef.current);
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

		// Show toast notification
		setToast({
			message: "Session paused",
			type: "warning",
			isVisible: true,
		});

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

		// Show toast notification
		setToast({
			message: "Session resumed",
			type: "info",
			isVisible: true,
		});

		// Timer will be started by the useEffect
	};

	// Calculate remaining time for planned sessions
	useEffect(() => {
		if (session.duration && !isPaused) {
			setRemainingTime(Math.max(0, session.duration * 60 - elapsedTime));
		}
	}, [elapsedTime, session.duration, isPaused]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space" && !e.repeat) {
				e.preventDefault();
				handlePauseResume();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handlePauseResume]);

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

	// Hold-to-confirm handlers for complete button
	const handleCompleteMouseDown = () => {
		setIsHoldingComplete(true);
		setHoldProgress(0);

		// Start progress bar animation
		holdProgressRef.current = setInterval(() => {
			setHoldProgress((prev) => {
				const newProgress =
					prev + (PROGRESS_UPDATE_INTERVAL / HOLD_DURATION) * 100;
				return Math.min(newProgress, 100);
			});
		}, PROGRESS_UPDATE_INTERVAL);

		// Start hold timer
		holdTimerRef.current = setTimeout(() => {
			// Clear timer
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}

			// Play completion sound (if available)
			try {
				// Create a simple beep sound using Web Audio API
				const audioContext = new (window.AudioContext ||
					(window as any).webkitAudioContext)();
				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);

				oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
				gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(
					0.01,
					audioContext.currentTime + 0.5
				);

				oscillator.start(audioContext.currentTime);
				oscillator.stop(audioContext.currentTime + 0.5);
			} catch (error) {
				// Fallback if audio is not supported
				console.log("Session completed!");
			}

			// Create completed session object
			const completedSession = {
				...session,
				status: "completed" as const,
				endTime: new Date(),
				elapsedTime,
			};

			onSessionComplete(completedSession);
			setIsHoldingComplete(false);
			setHoldProgress(0);
		}, HOLD_DURATION);
	};

	const handleCompleteMouseUp = () => {
		if (holdTimerRef.current) {
			clearTimeout(holdTimerRef.current);
			holdTimerRef.current = null;
		}
		if (holdProgressRef.current) {
			clearInterval(holdProgressRef.current);
			holdProgressRef.current = null;
		}
		setIsHoldingComplete(false);
		setHoldProgress(0);
	};

	const progressPercentage = getProgressPercentage();
	const isPlannedSession = session.sessionType === "planned";

	return (
		<>
			{/* Toast Notification */}
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					isVisible={toast.isVisible}
					onClose={() => setToast(null)}
					duration={2000}
				/>
			)}

			<div className="card max-w-xl w-full bg-transparent p-6 gap-6">
				{/* Session Header */}
				<div className="flex flex-col text-center">
					<h1 className="font-semibold text-lg">{session.goal}</h1>
					<p className="text-base-content/70 text-sm">
						{isPlannedSession
							? "Time-boxed focus session"
							: "Flow-based session"}
					</p>
				</div>

				{/* Timer Display */}
				<div className="text-center bg-base-100 group flex flex-col rounded-box gap-8 p-8">
					{isPlannedSession ? (
						<div className="space-y-2">
							<div className="text-4xl font-medium text-base-content font-mono">
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

					{isPlannedSession && (
						<div className="space-y-2">
							<div className="flex justify-between text-sm invisible transition-all group-hover:visible">
								<span className="text-base-content/70 font-medium">
									Progress
								</span>
								<span className="text-base-content font-medium">
									{Math.round(progressPercentage)}%
								</span>
							</div>

							<input
								type="range"
								className="range range-lg cursor-auto [--range-thumb:transparent] disabled w-full"
								value={progressPercentage}
								readOnly
							/>
						</div>
					)}
				</div>

				{/* Progress Bar for Planned Sessions */}

				{/* Session Info */}

				<div className="flex flex-col gap-4 text-sm bg-base-200 card rounded-box p-6">
					{/* Goal */}
					<div className="flex items-start gap-2">
						<Goal className="size-4 text-base-content/50 mt-0.5 flex-shrink-0" />
						<div className="flex-1">
							<span className="text-base-content/70 block mb-1">Goal:</span>
							<span className="text-base-content font-medium leading-relaxed">
								{session.goal || "No goal set"}
							</span>
						</div>
					</div>
					<div className="divider my-1"></div>

					{/* Started time */}
					<div className="flex align-middle items-center gap-2">
						<Clock className="size-4 text-base-content/50" />
						<span className="text-base-content/70">Started:</span>
						<span>{session.startTime.toLocaleTimeString()}</span>
					</div>

					{/* End time */}
					<div className="flex align-middle items-center gap-2">
						<Clock className="size-4 text-base-content/50" />
						<span className="text-base-content/70">Ends at:</span>
						<span>
							{isPlannedSession && session.duration
								? new Date(
										session.startTime.getTime() + session.duration * 60 * 1000
								  ).toLocaleTimeString()
								: "-"}
						</span>
					</div>

					{/* Focus level */}
					<div className="flex align-middle items-center gap-2">
						<Target className="size-4 text-base-content/50" />
						<span className="text-base-content/70">Focus Level</span>
						<span>{session.focusLevel}</span>
					</div>

					{/* Tags */}
					{session.tags.length > 0 && (
						<div className="flex items-start gap-2">
							<Hash className="size-4 text-base-content/50 mt-0.5 flex-shrink-0" />
							<div className="flex flex-wrap gap-2">
								{session.tags.map((tag, index) => (
									<span
										key={index}
										className="badge rounded-sm badge-secondary badge-sm"
									>
										#{tag}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Session Controls */}
				<div className="flex gap-3 w-full">
					{/* Complete Button */}
					<button
						onMouseDown={handleCompleteMouseDown}
						onMouseUp={handleCompleteMouseUp}
						onMouseLeave={handleCompleteMouseUp}
						onTouchStart={handleCompleteMouseDown}
						onTouchEnd={handleCompleteMouseUp}
						className={`btn btn-lg relative overflow-hidden ${
							isHoldingComplete ? "btn-neutral" : "btn-ghost"
						}`}
						title="End and complete this session (hold for 1.5s to confirm)"
					>
						{/* Progress bar overlay */}
						{isHoldingComplete && (
							<div
								className="absolute inset-0 bg-primary/20 transition-all duration-75 ease-out"
								style={{ width: `${holdProgress}%` }}
							/>
						)}
						<Square className="size-5 relative z-10" />
					</button>

					{/* Pause/Resume Button */}
					<button
						onClick={handlePauseResume}
						className={`btn btn-lg flex-1 ${isPaused ? "btn-primary" : ""}`}
						title={
							isPaused
								? "Resume the focus session (Space key)"
								: "Pause the focus session (Space key)"
						}
					>
						{isPaused ? (
							<Play className="size-5" />
						) : (
							<Pause className="size-5" />
						)}
					</button>
				</div>

				{/* Keyboard Shortcuts Hint */}
				{/* <div className="text-center text-xs text-base-content/50">
					<p>Space: Pause/Resume</p>
					<p>Hold Complete button for 1.5s to confirm</p>
				</div> */}

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
		</>
	);
}
