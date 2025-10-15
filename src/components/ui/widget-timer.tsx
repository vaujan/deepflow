"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
	Play,
	Clock,
	Timer as TimerIcon,
	Apple,
	Pause,
	Hash,
	Goal,
	Square,
	Target,
	ChevronDown,
	ChevronUp,
	AlertCircle,
	Loader2,
} from "lucide-react";
import { ScrollArea } from "./scroll-area";
import { useSession, type Session } from "../../hooks/useSession";
import { usePomodoroSettings } from "../../hooks/usePomodoroSettings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWidgets } from "@/src/contexts/WidgetContext";

// Unified Timer Widget: Start → Active → Completion in one component

export default function WidgetTimer() {
	const [duration, setDuration] = useState(25);
	const [goal, setGoal] = useState("");
	const [tags, setTags] = useState("");
	const [activeTab, setActiveTab] = useState<
		"time-boxed" | "open" | "pomodoro"
	>("time-boxed");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const {
		currentSession,
		isActive,
		isPaused,
		elapsedTime,
		remainingTime,
		startSession,
		pauseSession,
		resumeSession,
		completeSession,
		saveCompletedSession,
		dismissSession,
		updateDeepWorkQuality,
		updateSessionNotes,
		hasPendingSave,
	} = useSession();
	const { settings, updateSettings } = usePomodoroSettings();

	const { visibleWidgets } = useWidgets();

	const placeholders = [
		"Complete the project proposal...",
		"Read chapter 5 of the book...",
		"Write 500 words for the blog...",
		"Review and fix 3 bugs...",
		"Design the landing page...",
		"Practice piano for 30 minutes...",
	];
	const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
	const [isStarting, setIsStarting] = useState(false);
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
		}, 3000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (textareaRef.current) textareaRef.current.focus();
	}, []);

	const isGoalValid = goal.trim().length > 0;

	const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setDuration(parseInt(e.target.value));
	const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
		setGoal(e.target.value);
	const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTags(e.target.value);

	const handleTabChange = (tab: "time-boxed" | "open" | "pomodoro") => {
		setActiveTab(tab);
		if (tab === "pomodoro") setDuration(settings.pomodoroMinutes || 25);
	};

	const formatTime = (minutes: number) => {
		if (minutes < 60) return `${minutes} min.`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins > 0 ? `${mins}m` : ""}`.trim();
	};
	const getEndTime = (durationMinutes: number) => {
		const now = new Date();
		const endTime = new Date(now.getTime() + durationMinutes * 60 * 1000);
		return endTime.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const handleStartSession = async () => {
		if (isStarting || !isGoalValid) return;
		setIsStarting(true);
		const sessionConfig = {
			goal: goal.trim(),
			duration: activeTab !== "open" ? duration : undefined,
			tags: tags
				.trim()
				.split(/\s+/)
				.filter((t) => t.length > 0),
			sessionType: activeTab as "time-boxed" | "open" | "pomodoro",
		};
		try {
			await startSession(sessionConfig);
		} catch (e: any) {
			toast.error(e?.message || "Failed to start session");
		} finally {
			setIsStarting(false);
		}
	};

	// Update browser tab title with live timer when a session is running
	const formatSecondsForTitle = useCallback((seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		if (hours > 0)
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	}, []);

	useEffect(() => {
		if (typeof document === "undefined") return;
		const baseTitle = "Deepflow";
		if (currentSession && (isActive || isPaused)) {
			const isPlanned = currentSession.sessionType !== "open";
			const seconds = isPlanned
				? Math.max(0, remainingTime ?? 0)
				: Math.max(0, elapsedTime ?? 0);
			const timeText = formatSecondsForTitle(seconds);
			const prefix = isPaused ? "⏸" : "⏱";
			const goalText = currentSession.goal?.trim()
				? ` • ${currentSession.goal.trim()}`
				: "";
			document.title = `${prefix} ${timeText}${goalText} — ${baseTitle}`;
			return () => {
				document.title = baseTitle;
			};
		} else {
			document.title = baseTitle;
		}
	}, [
		currentSession,
		isActive,
		isPaused,
		elapsedTime,
		remainingTime,
		formatSecondsForTitle,
	]);

	const handleQualityUpdate = (sessionId: string, quality: number) =>
		updateDeepWorkQuality(sessionId, quality);
	const handleNotesUpdate = (sessionId: string, notes: string) =>
		updateSessionNotes(sessionId, notes);

	if (currentSession && currentSession.status === "completed") {
		return (
			<SessionCompletionView
				session={currentSession}
				onUpdateQuality={handleQualityUpdate}
				onUpdateNotes={handleNotesUpdate}
				onDismiss={dismissSession}
			/>
		);
	}

	if ((isActive || isPaused) && currentSession) {
		return (
			<ActiveSessionView
				session={currentSession}
				isPaused={isPaused}
				elapsedTime={elapsedTime}
				remainingTime={remainingTime}
				onPauseResume={() => (isPaused ? resumeSession() : pauseSession())}
				onComplete={() => completeSession(currentSession.id)}
			/>
		);
	}

	return (
		<div
			className={`card border-border ${
				visibleWidgets.length === 1
					? "md:bg-card shadow-xs borderas"
					: "md:bg-transparent"
			} w-full p-4 lg:p-6 gap-4 lg:gap-6 flex flex-col`}
		>
			<div className="flex flex-col text-center">
				<h1 className="font-semibold">What will you accomplish today?</h1>
				<p className="text-base-content/50">
					Write down your goal and start a focus session
				</p>
			</div>

			<div className="flex flex-col space-y-6 pr-2">
				<div className="relative">
					<textarea
						ref={textareaRef}
						id="goal"
						placeholder=""
						value={goal}
						onChange={handleGoalChange}
						maxLength={200}
						className={`textarea rounded-box textarea-md bg-base-100/50 backdrop-blur-sm w-full h-24 resize-none transition-all duration-200 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 ${
							!isGoalValid && goal.length > 0 ? "textarea-error" : ""
						} ${goal.length >= 200 ? "border-warning" : ""}`}
						style={{
							wordWrap: "break-word",
							overflowWrap: "break-word",
							whiteSpace: "pre-wrap",
							lineHeight: "1.5",
						}}
						required
					/>
					{!goal && (
						<div className="absolute inset-0 pointer-events-none flex items-start px-4 py-3">
							<div className="h-6 overflow-hidden">
								<div
									className="text-base-content/40 transition-transform duration-500 ease-in-out"
									style={{
										transform: `translateY(-${
											currentPlaceholderIndex * 1.5
										}rem)`,
									}}
								>
									{placeholders.map((placeholder, index) => (
										<div key={index} className="h-6 flex items-center">
											{placeholder}
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
				{!isGoalValid && goal.length > 0 && (
					<p className="text-error text-sm">
						Please enter your goal to continue
					</p>
				)}
				{goal.trim().length > 0 && (
					<div className="flex justify-start items-center text-xs">
						<span
							className={`${
								goal.length >= 180
									? goal.length >= 200
										? "text-error"
										: "text-warning"
									: "text-base-content/60"
							}`}
						>
							{goal.length}/200 characters
						</span>
					</div>
				)}
			</div>

			<div className="tabs tabs-border">
				<label className="tab font-medium">
					<input
						type="radio"
						name="session_tabs"
						checked={activeTab === "time-boxed"}
						onChange={() => handleTabChange("time-boxed")}
					/>
					<Clock className="size-4 me-2" />
					Time-boxed
				</label>
				<div className="tab-content rounded-box border border-border bg-base-200 dark:bg-base-100 p-6">
					<div className="space-y-4">
						<div className="flex text-sm justify-between items-center">
							<p className="font-medium">Duration: {formatTime(duration)}</p>
							<span className="badge rounded-sm badge-accent badge-soft">
								Time-boxed
							</span>
						</div>
						<div className="space-y-2">
							<input
								type="range"
								min="5"
								max="240"
								step={5}
								value={duration}
								onChange={handleDurationChange}
								className="range range-sm range-primary w-full"
							/>
							<div className="flex justify-between text-xs text-base-content/60">
								<span>|</span>
								<span>|</span>
								<span>|</span>
							</div>
							<div className="flex justify-between text-xs text-base-content/60">
								<span>5 min</span>
								<span>120 min</span>
								<span>240 min</span>
							</div>
						</div>
						<p className="text-xs text-base-content/60">
							Session will automatically end after {formatTime(duration)} at{" "}
							<span className="font-semibold">{getEndTime(duration)}</span>
						</p>
					</div>
				</div>
				<label className="font-medium tab">
					<input
						type="radio"
						name="session_tabs"
						checked={activeTab === "open"}
						onChange={() => handleTabChange("open")}
					/>
					<TimerIcon className="size-4 me-2" />
					Open
				</label>
				<div className="tab-content rounded-box border border-border bg-base-200 dark:bg-base-100 p-6">
					<div className="space-y-4">
						<div className="flex text-sm justify-between items-center">
							<p className="font-medium">Flow-based session</p>
							<span className="badge rounded-sm badge-soft badge-secondary">
								Max 4 hours
							</span>
						</div>
						<div className="bg-base-300 p-3 rounded-box text-center">
							<p className="text-sm text-base-content/70">
								Start when ready, end when you naturally done
							</p>
						</div>
						<p className="text-xs text-base-content/60">
							Timer counts up to 4 hours, then stops automatically
						</p>
					</div>
				</div>
				{/* Pomodoro scaffold (hidden in UI but keeps settings accessible) */}
				{/* <label className="font-medium tab">
                    <input type="radio" name="session_tabs" checked={activeTab === "pomodoro"} onChange={() => handleTabChange("pomodoro")} />
                    <Apple className="size-4 me-2" />
                    Pomodoro
                </label> */}
			</div>

			<div className="h-fit">
				<div className="collapse border border-border bg-base-200 dark:bg-base-100">
					<input type="checkbox" className="peer" />
					<div className="collapse-title text-sm font-medium">
						Tags (Optional)
					</div>
					<div className="collapse-content">
						<div className="space-y-4 pt-2">
							<div className="form-control">
								<label className="label">
									<span className="label-text-alt text-xs text-base-content/60">
										Separate with spaces
									</span>
								</label>
								<input
									type="text"
									placeholder="blog essay urgent work"
									value={tags}
									onChange={handleTagsChange}
									className="input input-sm w-full bg-base-200"
								/>
								{tags.trim() && (
									<div className="flex flex-wrap gap-1 mt-2">
										{tags
											.trim()
											.split(/\s+/)
											.filter((tag) => tag.length > 0)
											.map((tag, index) => (
												<span
													key={index}
													className="badge badge-sm badge-soft badge-neutral rounded-sm"
												>
													#{tag.replace(/^#/, "")}
												</span>
											))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="card-actions flex-shrink-0">
				<button
					className={`btn btn-block mb-8 h-14 transition-all duration-200 ${
						isGoalValid ? "btn-primary" : "btn-disabled"
					}`}
					disabled={!isGoalValid || isStarting}
					onClick={handleStartSession}
					style={{ touchAction: "manipulation" }}
					aria-disabled={!isGoalValid || isStarting}
					aria-busy={isStarting}
					aria-label="Start focus session"
				>
					{isStarting && <Loader2 className="size-4 animate-spin" />}
					<Play className="size-4" />
					<span>
						Start {activeTab === "open" ? "Open" : formatTime(duration)} Session
					</span>
				</button>
			</div>
		</div>
	);
}

// ================= Active Session (inline) =================

function ActiveSessionView({
	session,
	isPaused,
	elapsedTime,
	remainingTime,
	onPauseResume,
	onComplete,
}: {
	session: Session;
	isPaused: boolean;
	elapsedTime: number;
	remainingTime: number | null;
	onPauseResume: () => void;
	onComplete: () => void;
}) {
	const [isTimerExpanded, setIsTimerExpanded] = useState(false);
	const [isTimeVisible, setIsTimeVisible] = useState(true);

	const handlePauseResume = useCallback(() => onPauseResume(), [onPauseResume]);

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		if (hours > 0)
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	};

	const getProgressPercentage = () => {
		if (!session.duration) return 0;
		return Math.min((elapsedTime / (session.duration * 60)) * 100, 100);
	};

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
		} catch {}
	};

	const isPlannedSession = session.sessionType !== "open";
	const progressPercentage = getProgressPercentage();
	const toggleTimeVisibility = useCallback(
		() => setIsTimeVisible((p) => !p),
		[]
	);
	const truncateGoal = (goal: string, maxLength: number = 100) =>
		goal.length <= maxLength ? goal : goal.substring(0, maxLength) + "...";

	const confirmComplete = () => onComplete();

	return (
		<div className="card bg-transparent w-full p-4 lg:p-6 gap-4 lg:gap-6 flex flex-col">
			<div className="flex flex-col text-center flex-shrink-0">
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

			<ScrollArea className="flex-1 min-h-0">
				<div className="flex flex-col gap-4 pr-2">
					<div
						className={`text-center border border-border bg-card z-10 group flex flex-col rounded-box gap-8 p-8 cursor-pointer transition-all duration-300 ease-out transform ${
							isTimerExpanded ? "bg-base-200" : "bg-card scale-100"
						}`}
						onClick={() => setIsTimerExpanded(!isTimerExpanded)}
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
								<div className="relative">
									<div className="w-full flex align-middle items-center h-2 bg-base-300">
										<div
											className="h-4 bg-base-content transition-all ease-out relative "
											style={{ width: `${progressPercentage}%` }}
										></div>
									</div>
								</div>
							</div>
						)}

						<div className="flex invisible group-hover:visible justify-center">
							{isTimerExpanded ? (
								<ChevronUp className="size-4 text-base-content/50 transition-all duration-300 ease-out transform rotate-0" />
							) : (
								<ChevronDown className="size-4 text-base-content/50 transition-all duration-300 ease-out transform rotate-0" />
							)}
						</div>
					</div>

					<div
						className={`flex flex-col gap-4 text-sm bg-base-200/50 card rounded-box p-6 overflow-hidden transition-all duration-300 ease-out ${
							isTimerExpanded
								? "max-h-96 h-fit opacity-100 -mt-14 pt-14"
								: "max-h-0 opacity-0 p-0 mt-0"
						}`}
					>
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
						{isTimeVisible && (
							<div className="flex align-middle items-center gap-2">
								<Clock className="size-4 text-base-content/50" />
								<span className="text-base-content/70">Started:</span>
								<span>{session.startTime.toLocaleTimeString()}</span>
							</div>
						)}
						{isTimeVisible && (
							<div className="flex align-middle items-center gap-2">
								<Clock className="size-4 text-base-content/50" />
								<span className="text-base-content/50">Ends at:</span>
								<span>
									{isPlannedSession && session.duration
										? new Date(
												session.startTime.getTime() +
													session.duration * 60 * 1000
										  ).toLocaleTimeString()
										: "-"}
								</span>
							</div>
						)}
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

					<div className="flex gap-3 w-full">
						<button
							onClick={confirmComplete}
							className="btn btn-lg btn-ghost"
							title="End and complete this session"
							aria-label="End and complete this session"
							style={{ touchAction: "manipulation" }}
						>
							<Square className="size-5" />
						</button>
						<button
							onClick={handlePauseResume}
							className={`btn btn-lg flex-1 ${isPaused ? "btn-primary" : ""}`}
							title={
								isPaused
									? "Resume the focus session"
									: "Pause the focus session"
							}
							aria-label={isPaused ? "Resume session" : "Pause session"}
						>
							{isPaused ? (
								<Play className="size-5" />
							) : (
								<Pause className="size-5" />
							)}
						</button>
					</div>

					<div className="text-center w-full justify-center">
						<button
							onClick={toggleTimeVisibility}
							className="btn btn-xs btn-ghost hover:opacity-100 opacity-25"
							title={isTimeVisible ? "Hide time display" : "Show time display"}
							aria-label={isTimeVisible ? "Hide time" : "Show time"}
						>
							{isTimeVisible ? "Hide Time" : "Show Time"}
						</button>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}

// ================= Completion (inline) =================

function SessionCompletionView({
	session,
	onUpdateQuality,
	onUpdateNotes,
	onDismiss,
}: {
	session: Session;
	onUpdateQuality?: (id: string, q: number) => void;
	onUpdateNotes?: (id: string, n: string) => void;
	onDismiss?: () => void;
}) {
	const router = useRouter();
	const [deepWorkQuality, setDeepWorkQuality] = useState<number>(
		session.deepWorkQuality || 0
	);
	const [hasRated, setHasRated] = useState<boolean>(!!session.deepWorkQuality);
	const [hoverRating, setHoverRating] = useState<number>(0);
	const [notes, setNotes] = useState<string>(session.notes || "");
	const isPlannedSession = session.sessionType === "time-boxed";

	const getCompletionTypeMessage = () => {
		if (!session.completionType) return "";
		switch (session.completionType) {
			case "premature":
				return "Session ended early";
			case "overtime":
				return "Session went over time";
			case "completed":
				return "Session completed on time";
			default:
				return "";
		}
	};
	const getCompletionTypeColor = () => {
		if (!session.completionType) return "alert";
		switch (session.completionType) {
			case "premature":
				return "alert alert-soft alert-warning";
			case "overtime":
				return "alert alert-soft alert-info";
			case "completed":
				return "alert alert-soft  alert-success";
			default:
				return "alert";
		}
	};
	const getRatingLabel = (rating: number) => {
		const labels = [
			"Distracted - Mind wandering, easily interrupted",
			"Poor Focus - Struggling to concentrate",
			"Below Average - Some focus but inconsistent",
			"Average - Moderate concentration",
			"Good - Decent focus maintained",
			"Above Average - Strong concentration",
			"Very Good - Deep focus with few distractions",
			"Excellent - Sustained deep work",
			"Outstanding - Exceptional focus and flow",
			"In Flow - Perfect focus, time flies by",
		];
		return labels[rating - 1] || "";
	};
	const getRatingColor = (rating: number) =>
		rating <= 3
			? "text-error"
			: rating <= 5
			? "text-warning"
			: rating <= 7
			? "text-info"
			: "text-success";

	const handleQualityRating = (rating: number) => {
		if (rating === 0) {
			setDeepWorkQuality(0);
			setHasRated(false);
			onUpdateQuality?.(session.id, 0);
		} else {
			setDeepWorkQuality(rating);
			setHasRated(true);
			onUpdateQuality?.(session.id, rating);
		}
	};
	const handleNotesChange = (newNotes: string) => {
		setNotes(newNotes);
		onUpdateNotes?.(session.id, newNotes);
	};
	const [isSaving, setIsSaving] = useState(false);
	const { saveCompletedSession, hasPendingSave } = useSession();
	const handleSaveSession = async () => {
		if (isSaving) return;
		setIsSaving(true);
		try {
			const saved = await saveCompletedSession();
			const minutes = Math.round(
				((saved?.elapsedTime ?? session.elapsedTime ?? 0) as number) / 60
			);
			// TEMPORARILY DISABLED: 5-minute minimum check
			// if (
			// 	(saved?.status === "completed" || saved?.status === "stopped") &&
			// 	(saved?.elapsedTime ?? session.elapsedTime ?? 0) < 300
			// ) {
			// 	toast.info("Session under 5 minutes was discarded and not counted.");
			// } else {
			toast.success(
				`Deep work logged — ${minutes} minutes of focused progress. Nice work!`
			);
			// }
			onDismiss?.();
		} catch (e: any) {
			toast.error(e?.message || "Failed to save session");
		} finally {
			setIsSaving(false);
		}
	};

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		if (hours > 0)
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="card bg-transparent w-full h-fit p-4 lg:p-6 gap-4 lg:gap-6 flex flex-col">
			<div className="flex flex-col text-center flex-shrink-0">
				<h1 className="font-semibold">Session Complete</h1>
				<p className="text-base-content/50">
					{isPlannedSession
						? "Great job! You completed your planned focus session."
						: "Excellent work! You finished your flow session."}
				</p>
			</div>

			<ScrollArea className="flex-1 min-h-0">
				<div className="flex flex-col gap-4 pr-2">
					{session.completionType && isPlannedSession && (
						<div className={`${getCompletionTypeColor()} gap-2`}>
							<AlertCircle className="size-4" />
							<span className="text-sm font-medium">
								{getCompletionTypeMessage()}
							</span>
						</div>
					)}
					<div className="flex flex-col gap-4 text-sm bg-card border border-border card rounded-box p-6">
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
									{session.goal}
								</span>
							</div>
						</div>
						<div className="flex align-middle items-center gap-2">
							<Target className="size-4 text-base-content/50" />
							<span className="text-base-content/70">Session Type:</span>
							<span className="font-medium">
								{session.sessionType === "time-boxed"
									? "Time-boxed Session"
									: "Flow Session"}
							</span>
						</div>
						<div className="flex align-middle items-center gap-2">
							<Clock className="size-4 text-base-content/50" />
							<span className="text-base-content/70">Started:</span>
							<span>{session.startTime.toLocaleTimeString()}</span>
						</div>
						<div className="flex align-middle items-center gap-2">
							<Clock className="size-4 text-base-content/50" />
							<span className="text-base-content/70">Duration:</span>
							<span className="font-medium">
								{Math.round((session.elapsedTime ?? 0) / 60)} minutes
							</span>
						</div>
						{isPlannedSession && (
							<div className="flex align-middle items-center gap-2">
								<Clock className="size-4 text-base-content/50" />
								<span className="text-base-content/70">Expected End:</span>
								<span>
									{session.expectedEndTime
										? session.expectedEndTime.toLocaleTimeString()
										: "-"}
								</span>
							</div>
						)}
						<div className="flex align-middle items-center gap-2">
							<Clock className="size-4 text-base-content/50" />
							<span className="text-base-content/70">Actual End:</span>
							<span>
								{session.endTime ? session.endTime.toLocaleTimeString() : "-"}
							</span>
						</div>
						{session.tags.length > 0 && (
							<div className="flex items-start gap-2">
								<Hash className="size-4 text-base-content/50 mt-0.5 flex-shrink-0" />
								<div className="flex flex-wrap gap-2">
									{session.tags.map((tag, index) => (
										<span
											key={index}
											className="badge rounded-sm badge-neutral badge-sm"
										>
											#{tag}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="card bg-card border border-border p-6 gap-6">
						<div className="flex flex-col gap-1 text-center">
							<h3 className="font-medium text-base-content w-full text-center">
								Rate Your Deep Work Quality
							</h3>
							<p className="text-sm text-base-content/70">
								How would you rate the quality of your focus during this
								session?
							</p>
						</div>
						<div className="space-y-4">
							<div className="flex flex-col items-center gap-3">
								<div className="flex justify-center">
									<div className="rating">
										{Array.from({ length: 10 }, (_, i) => (
											<input
												key={i + 1}
												type="radio"
												name={`rating-${session.id}`}
												className="mask mask-star cursor-pointer"
												checked={deepWorkQuality === i + 1}
												onChange={() => handleQualityRating(i + 1)}
												onMouseEnter={() => setHoverRating(i + 1)}
												onMouseLeave={() => setHoverRating(0)}
											/>
										))}
									</div>
								</div>
								{hoverRating > 0 && (
									<div className={`text-center ${getRatingColor(hoverRating)}`}>
										<span className="font-medium text-sm">
											{hoverRating}/10 - {getRatingLabel(hoverRating)}
										</span>
									</div>
								)}
								{!hoverRating && deepWorkQuality > 0 && (
									<div
										className={`text-center ${getRatingColor(deepWorkQuality)}`}
									>
										<span className="font-medium text-sm">
											{deepWorkQuality}/10 - {getRatingLabel(deepWorkQuality)}
										</span>
									</div>
								)}
							</div>
							{hasRated && (
								<div className="text-center pt-2 border-t border-base-300">
									<p className="text-xs text-base-content/70 mt-mp1">
										Current rating:{" "}
										<button
											className={`font-medium badge badge-sm px-2 badge-soft rounded-sm hover:badge-error transition-all duration-200 cursor-pointer group`}
											onClick={() => handleQualityRating(0)}
											title="Reset Rating"
										>
											<span className="group-hover:hidden">
												{deepWorkQuality}/10 - {getRatingLabel(deepWorkQuality)}
											</span>
											<span className="hidden group-hover:inline">
												Reset Rating
											</span>
										</button>
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="collapse border border-base-100 bg-card">
						<input type="checkbox" className="peer" />
						<div className="collapse-title text-sm font-medium">
							Notes (Optional)
						</div>
						<div className="collapse-content">
							<div className="space-y-4 pt-2">
								<div className="form-control">
									<textarea
										className="textarea border-0 shadow-none w-full min-h-[100px] resize-none"
										placeholder="What went well? What could be improved? Any distractions or breakthroughs?"
										value={notes}
										onChange={(e) => handleNotesChange(e.target.value)}
									/>
									<label className="label">
										<span className="label-text-alt text-xs text-base-content/60">
											Add any thoughts, insights, or observations
										</span>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>

			<div className="card-actions justify-center flex-shrink-0 pt-2 pb-6">
				<button
					onClick={handleSaveSession}
					className="btn btn-primary btn-block"
					disabled={!hasRated || isSaving}
				>
					{isSaving ? (
						<span className="inline-flex items-center gap-2">
							<Loader2 className="size-4 animate-spin" /> Saving…
						</span>
					) : hasRated ? (
						"Save Session"
					) : (
						"Rate Session to Continue"
					)}
				</button>
			</div>
		</div>
	);
}
