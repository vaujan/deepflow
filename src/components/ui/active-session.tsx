import React, { useState, useEffect, useRef } from "react";
import { Pause, Play, Square, Check, Clock, Target, Hash } from "lucide-react";
import { Session } from "../../hooks/useSession";
import Toast from "./toast";

interface ActiveSessionProps {
	session: Session;
	onSessionComplete: (completedSession: Session) => void;
	onSessionStop: () => void;
}

export default function ActiveSession({
	session,
	onSessionComplete,
	onSessionStop,
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

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<Date>(session.startTime);
	const pauseTimeRef = useRef<Date | null>(null);
	const totalPausedTimeRef = useRef(0);

	// Start timer when component mounts
	useEffect(() => {
		startTimer();
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space" && !e.repeat) {
				e.preventDefault();
				handlePauseResume();
			} else if (e.code === "Escape") {
				e.preventDefault();
				handleStop();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const startTimer = () => {
		timerRef.current = setInterval(() => {
			setElapsedTime((prev) => {
				const newElapsed = prev + 1;

				// For planned sessions, check if time is up
				if (session.duration && newElapsed >= session.duration * 60) {
					handleSessionComplete();
					return newElapsed;
				}

				return newElapsed;
			});
		}, 1000);
	};

	const handlePauseResume = () => {
		if (isPaused) {
			resumeSession();
		} else {
			pauseSession();
		}
	};

	const pauseSession = () => {
		setIsPaused(true);
		pauseTimeRef.current = new Date();

		// Play pause sound
		playSound(400, 0.2, 0.3);

		// Show toast notification
		setToast({
			message: "Session paused",
			type: "warning",
			isVisible: true,
		});

		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const resumeSession = () => {
		setIsPaused(false);
		if (pauseTimeRef.current) {
			totalPausedTimeRef.current += Date.now() - pauseTimeRef.current.getTime();
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

		startTimer();
	};

	const handleStop = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		// Show toast notification
		setToast({
			message: "Session stopped",
			type: "error",
			isVisible: true,
		});

		onSessionStop();
	};

	const handleSessionComplete = () => {
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
	};

	// Calculate remaining time for planned sessions
	useEffect(() => {
		if (session.duration && !isPaused) {
			setRemainingTime(Math.max(0, session.duration * 60 - elapsedTime));
		}
	}, [elapsedTime, session.duration, isPaused]);

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

			<div className="card max-w-xl w-full border-base-100 border bg-transparent p-6 gap-6">
				{/* Session Header */}
				<div className="flex flex-col text-center">
					<h1 className="font-semibold text-lg">Active Session</h1>
					<p className="text-base-content/70 text-sm">
						{isPlannedSession
							? "Time-boxed focus session"
							: "Flow-based session"}
					</p>
				</div>

				{/* Goal Display */}
				<div className="bg-base-100/50 backdrop-blur-sm rounded-box p-4 border border-base-200">
					<div className="flex items-start gap-3">
						<Target className="size-5 text-primary mt-0.5 flex-shrink-0" />
						<div className="flex-1">
							<h3 className="font-medium text-sm text-base-content/70 mb-1">
								Goal
							</h3>
							<p className="text-base-content">{session.goal}</p>
						</div>
					</div>
				</div>

				{/* Timer Display */}
				<div className="text-center">
					{isPlannedSession ? (
						<div className="space-y-2">
							<div className="text-4xl font-mono font-bold text-primary">
								{remainingTime ? formatTime(remainingTime) : "00:00"}
							</div>
							<p className="text-sm text-base-content/60">
								{isPaused ? "Paused" : "Remaining"}
							</p>
						</div>
					) : (
						<div className="space-y-2">
							<div className="text-4xl font-mono font-bold text-primary">
								{formatTime(elapsedTime)}
							</div>
							<p className="text-sm text-base-content/60">
								{isPaused ? "Paused" : "Elapsed time"}
							</p>
						</div>
					)}
				</div>

				{/* Progress Bar for Planned Sessions */}
				{isPlannedSession && (
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-base-content/70">Progress</span>
							<span className="text-primary font-medium">
								{Math.round(progressPercentage)}%
							</span>
						</div>
						<div className="w-full bg-base-200 rounded-full h-2">
							<div
								className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
					</div>
				)}

				{/* Session Info */}
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="flex items-center gap-2">
						<Clock className="size-4 text-base-content/50" />
						<span className="text-base-content/70">Started:</span>
						<span>{session.startTime.toLocaleTimeString()}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="size-4 rounded-full bg-secondary flex items-center justify-center">
							<span className="text-xs font-bold text-secondary-content">
								{session.focusLevel}
							</span>
						</div>
						<span className="text-base-content/70">Focus Level</span>
					</div>
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

				{/* Session Controls */}
				<div className="card-actions justify-center gap-3">
					{/* Pause/Resume Button */}
					<button
						onClick={handlePauseResume}
						className={`btn btn-circle btn-lg ${
							isPaused ? "btn-primary" : "btn-outline"
						}`}
						title={
							isPaused ? "Resume session (Space)" : "Pause session (Space)"
						}
					>
						{isPaused ? (
							<Play className="size-5" />
						) : (
							<Pause className="size-5" />
						)}
					</button>

					{/* Stop Button */}
					<button
						onClick={handleStop}
						className="btn btn-circle btn-lg btn-outline btn-error"
						title="Stop session (Esc)"
					>
						<Square className="size-5" />
					</button>

					{/* Complete Button */}
					<button
						onClick={handleSessionComplete}
						className="btn btn-circle btn-lg btn-success"
						title="Complete session"
					>
						<Check className="size-5" />
					</button>
				</div>

				{/* Keyboard Shortcuts Hint */}
				<div className="text-center text-xs text-base-content/50">
					<p>Space: Pause/Resume • Esc: Stop</p>
				</div>

				{/* Session Status */}
				<div className="text-center">
					<div
						className={`badge badge-lg ${
							isPaused ? "badge-warning" : "badge-success"
						}`}
					>
						{isPaused ? "PAUSED" : "ACTIVE"}
					</div>
				</div>
			</div>
		</>
	);
}
