"use client";

import { Play, Clock, Timer, Check, Apple, Pause, Square } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useSession, Session } from "../../hooks/useSession";
import ActiveSession from "./active-session";
import SessionCompletion from "./session-completion";

export default function WidgetTimer() {
	const [duration, setDuration] = useState(25);
	const [focusLevel, setFocusLevel] = useState("5");
	const [goal, setGoal] = useState("");
	const [tags, setTags] = useState("");
	const [activeTab, setActiveTab] = useState<
		"time-boxed" | "open" | "pomodoro"
	>("time-boxed");
	const [isHolding, setIsHolding] = useState(false);
	const [holdProgress, setHoldProgress] = useState(0);
	const [completedSession, setCompletedSession] = useState<Session | null>(
		null
	);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
	const holdProgressRef = useRef<NodeJS.Timeout | null>(null);

	const HOLD_DURATION = 1500; // 1.5 seconds in milliseconds
	const PROGRESS_UPDATE_INTERVAL = 16; // ~60fps for smooth progress bar

	// Session management
	const {
		currentSession,
		isActive,
		startSession,
		updateDeepWorkQuality,
		updateSessionNotes,
	} = useSession();

	const placeholders = [
		"Complete the project proposal...",
		"Read chapter 5 of the book...",
		"Write 500 words for the blog...",
		"Review and fix 3 bugs...",
		"Design the landing page...",
		"Practice piano for 30 minutes...",
	];

	const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDuration(parseInt(e.target.value));
	};

	const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setGoal(e.target.value);
	};

	const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTags(e.target.value);
	};

	const renderTags = (tagsString: string) => {
		if (!tagsString.trim()) return null;
		const tagArray = tagsString
			.trim()
			.split(/\s+/)
			.filter((tag) => tag.length > 0)
			.map((tag) => tag.replace(/^#+/, "")) // Remove leading # symbols
			.filter((tag, index, array) => array.indexOf(tag) === index); // Remove duplicates

		return (
			<div className="flex flex-wrap gap-2 mt-2">
				{tagArray.map((tag, index) => (
					<span key={index} className="badge rounded-sm badge-neutral badge-sm">
						#{tag}
					</span>
				))}
			</div>
		);
	};

	const handleTabChange = (tab: "time-boxed" | "open" | "pomodoro") => {
		setActiveTab(tab);
	};

	const formatTime = (minutes: number) => {
		if (minutes < 60) {
			return `${minutes} min.`;
		}
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

	const handleStartSession = () => {
		const sessionConfig = {
			goal: goal.trim(),
			duration: activeTab === "time-boxed" ? duration : undefined,
			focusLevel: parseInt(focusLevel),
			tags: tags
				.trim()
				.split(/\s+/)
				.filter((tag) => tag.length > 0),
			sessionType: activeTab as "time-boxed" | "open" | "pomodoro",
		};

		startSession(sessionConfig);
	};

	const handleSessionComplete = (session: Session) => {
		setCompletedSession(session);
	};

	const handleQualityUpdate = (sessionId: string, quality: number) => {
		updateDeepWorkQuality(sessionId, quality);
		// Update the completed session with the new quality rating
		if (completedSession && completedSession.id === sessionId) {
			setCompletedSession({
				...completedSession,
				deepWorkQuality: quality,
			});
		}
	};

	const handleNotesUpdate = (sessionId: string, notes: string) => {
		updateSessionNotes(sessionId, notes);
		// Update the completed session with the new notes
		if (completedSession && completedSession.id === sessionId) {
			setCompletedSession({
				...completedSession,
				notes,
			});
		}
	};

	const handleMouseDown = () => {
		if (!isGoalValid) return;

		setIsHolding(true);
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
			handleStartSession();
			setIsHolding(false);
			setHoldProgress(0);
		}, HOLD_DURATION);
	};

	const handleMouseUp = () => {
		if (holdTimerRef.current) {
			clearTimeout(holdTimerRef.current);
			holdTimerRef.current = null;
		}
		if (holdProgressRef.current) {
			clearInterval(holdProgressRef.current);
			holdProgressRef.current = null;
		}
		setIsHolding(false);
		setHoldProgress(0);
	};

	const handleMouseLeave = () => {
		handleMouseUp();
	};

	// Cleanup timers on unmount
	useEffect(() => {
		return () => {
			if (holdTimerRef.current) {
				clearTimeout(holdTimerRef.current);
			}
			if (holdProgressRef.current) {
				clearInterval(holdProgressRef.current);
			}
		};
	}, []);

	const isGoalValid = goal.trim().length > 0;

	// If there's a completed session, show the completion component
	if (completedSession) {
		return (
			<SessionCompletion
				session={completedSession}
				onUpdateQuality={handleQualityUpdate}
				onUpdateNotes={handleNotesUpdate}
			/>
		);
	}

	// If there's an active session, show the active session component
	if (isActive && currentSession) {
		return (
			<ActiveSession
				session={currentSession}
				onSessionComplete={handleSessionComplete}
			/>
		);
	}

	return (
		<div className="w-full h-full min-w-lg max-w-xl group flex flex-col overflow-hidden">
			<div className="flex justify-between items-center text-base-content/80 mb-4">
				<div className="flex gap-2 items-center justify-center w-fit">
					<Timer className="size-5 text-primary" />
					<span className="font-medium text-lg">Timer</span>
				</div>
			</div>

			<div className="card h-fit border border-border bg-card shadow-xs p-4 gap-4 overflow-hidden">
				<div className="flex flex-col text-center">
					<h3 className="font-semibold text-base-content">
						What will you accomplish today?
					</h3>
					<p className="text-base-content/50 text-sm">
						Write down your goal and start a focus session
					</p>
				</div>

				{/* Goal Input */}
				<div className="flex flex-col space-y-3">
					<div className="relative">
						<textarea
							ref={textareaRef}
							placeholder="Enter your focus goal..."
							value={goal}
							onChange={handleGoalChange}
							maxLength={200}
							className={`textarea rounded-box textarea-sm bg-base-100/50 backdrop-blur-sm w-full h-20 resize-none transition-all duration-200 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 ${
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
					</div>
					{!isGoalValid && goal.length > 0 && (
						<p className="text-error text-xs">
							Please enter your goal to continue
						</p>
					)}
				</div>

				{/* Session Mode Tabs */}
				<div className="tabs tabs-border">
					<label className="tab font-medium text-xs">
						<input
							type="radio"
							name="session_tabs"
							checked={activeTab === "time-boxed"}
							onChange={() => handleTabChange("time-boxed")}
						/>
						<Clock className="size-3 me-1" />
						Time-boxed
					</label>
					<div className="tab-content rounded-box border border-border bg-base-200 dark:bg-base-100 p-3">
						<div className="space-y-3">
							<div className="flex text-xs justify-between items-center">
								<p className="font-medium">Duration: {formatTime(duration)}</p>
								<span className="badge rounded-sm badge-accent badge-soft text-xs">
									Time-boxed
								</span>
							</div>
							<div className="space-y-2">
								<input
									type="range"
									min="5"
									max="120"
									step={5}
									value={duration}
									onChange={handleDurationChange}
									className="range range-xs range-primary w-full"
								/>
								<div className="flex justify-between text-xs text-base-content/60">
									<span>5 min</span>
									<span>60 min</span>
									<span>120 min</span>
								</div>
							</div>
							<p className="text-xs text-base-content/60">
								Session will end at{" "}
								<span className="font-semibold">{getEndTime(duration)}</span>
							</p>
						</div>
					</div>
					<label className="font-medium tab text-xs">
						<input
							type="radio"
							name="session_tabs"
							checked={activeTab === "open"}
							onChange={() => handleTabChange("open")}
						/>
						<Timer className="size-3 me-1" />
						Open
					</label>
					<div className="tab-content rounded-box border border-border bg-base-200 dark:bg-base-100 p-3">
						<div className="space-y-3">
							<div className="flex text-xs justify-between items-center">
								<p className="font-medium">Flow-based session</p>
								<span className="badge rounded-sm badge-soft badge-secondary text-xs">
									No time limit
								</span>
							</div>
							<div className="bg-base-300 p-2 rounded-box text-center">
								<p className="text-xs text-base-content/70">
									Start when ready, end when naturally done
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Tags Input */}
				<div className="collapse border border-border bg-base-200 dark:bg-base-100">
					<input type="checkbox" className="peer" />
					<div className="collapse-title text-xs font-medium">
						Tags (Optional)
					</div>
					<div className="collapse-content">
						<div className="space-y-2 pt-2">
							<input
								type="text"
								placeholder="blog essay urgent work"
								value={tags}
								onChange={handleTagsChange}
								className="input input-xs w-full bg-base-200"
							/>
							{renderTags(tags)}
						</div>
					</div>
				</div>

				<div className="card-actions">
					<button
						className={`btn btn-block h-10 transition-all duration-200 relative overflow-hidden text-sm ${
							isGoalValid
								? isHolding
									? "btn-primary"
									: "btn-neutral"
								: "btn-disabled"
						}`}
						disabled={!isGoalValid}
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseLeave}
						onTouchStart={handleMouseDown}
						onTouchEnd={handleMouseUp}
					>
						{/* Progress bar overlay */}
						{isHolding && (
							<div
								className="absolute inset-0 bg-primary/20 transition-all duration-75 ease-out"
								style={{
									width: `${holdProgress}%`,
									transition: `width ${PROGRESS_UPDATE_INTERVAL}ms linear`,
								}}
							/>
						)}

						{/* Button content */}
						<div className="relative z-10 flex items-center gap-2">
							{isHolding && holdProgress >= 100 ? (
								<Check className="size-3" />
							) : (
								<Play className="size-3" />
							)}
							<span>
								{isHolding && holdProgress >= 100
									? "Starting..."
									: `Hold to Start ${
											activeTab === "time-boxed" ? formatTime(duration) : "Open"
									  } Session`}
							</span>
						</div>

						{/* Hold indicator */}
						{isHolding && (
							<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-primary-content/80">
								{Math.ceil(
									(HOLD_DURATION - (holdProgress / 100) * HOLD_DURATION) / 1000
								)}
								s
							</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
