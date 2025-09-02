"use client";

import { Play, Clock, Timer, Check } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useSession, Session } from "../../hooks/useSession";
import ActiveSession from "./active-session";
import SessionCompletion from "./session-completion";

export default function SessionCard() {
	const [duration, setDuration] = useState(25);
	const [focusLevel, setFocusLevel] = useState("5");
	const [goal, setGoal] = useState("");
	const [tags, setTags] = useState("");
	const [additionalNotes, setAdditionalNotes] = useState("");
	const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
	const [activeTab, setActiveTab] = useState<"planned" | "open">("planned");
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

	// Auto-focus textarea when component mounts
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, []);

	// Rotate placeholders every 3 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [placeholders.length]);

	const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDuration(parseInt(e.target.value));
	};

	const handleFocusLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFocusLevel(e.target.value);
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

	const handleTabChange = (tab: "planned" | "open") => {
		setActiveTab(tab);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && e.ctrlKey && isGoalValid) {
			// Ctrl+Enter to start session
			e.preventDefault();
			// TODO: Implement session start logic
			console.log("Starting session with Ctrl+Enter");
		}
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
			duration: activeTab === "planned" ? duration : undefined,
			focusLevel: parseInt(focusLevel),
			tags: tags
				.trim()
				.split(/\s+/)
				.filter((tag) => tag.length > 0),
			sessionType: activeTab as "planned" | "open",
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
		<div className="card bg-base-100 min-w-lg w-full xl:max-w-lg p-4 lg:p-6 gap-4 lg:gap-6 overflow-hidden">
			<div className="flex flex-col text-center">
				<h1 className="font-semibold">What will you accomplish today?</h1>
				<p className="text-base-content/50">
					Write down your goal and start a focus session
				</p>
			</div>

			{/* Goal Input - Center of the Component */}
			<div className="flex flex-col space-y-3">
				<div className="relative">
					<textarea
						ref={textareaRef}
						id="goal"
						placeholder=""
						value={goal}
						onChange={handleGoalChange}
						onKeyDown={handleKeyDown}
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

			{/* Session Mode Tabs */}
			<div className="tabs tabs-border">
				<label className="tab font-medium">
					<input
						type="radio"
						name="session_tabs"
						checked={activeTab === "planned"}
						onChange={() => handleTabChange("planned")}
					/>
					<Clock className="size-4 me-2" />
					Planned Session
				</label>
				<div className="tab-content rounded-box border-base-100 border bg-base-200 p-6">
					{/* Planned Session Mode */}
					<div className="space-y-4">
						<div className="flex text-sm justify-between items-center">
							<p className="font-medium">Duration: {formatTime(duration)}</p>
							<span className="badge rounded-sm badge-soft bg-secondary/20">
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
					<Timer className="size-4 me-2" />
					Open Session
				</label>
				<div className="tab-content rounded-box bg-base-200 border-base-100 border p-6">
					{/* Open Session Mode */}
					<div className="space-y-4">
						<div className="flex text-sm justify-between items-center">
							<p className="font-medium">Flow-based session</p>
							<span className="badge rounded-sm badge-soft bg-secondary/20">
								No time limit
							</span>
						</div>
						<div className="bg-base-300 p-3 rounded-box text-center">
							<p className="text-sm text-base-content/70">
								Start when ready, end when you naturally done
							</p>
						</div>
						<p className="text-xs text-base-content/60">
							Timer will count up from zero until you manually stop
						</p>
					</div>
				</div>
			</div>

			{/* Optional Inputs Group */}
			<div className="collapse border border-base-100 bg-base-200">
				<input type="checkbox" className="peer" />
				<div className="collapse-title text-sm font-medium">
					Tags (Optional)
				</div>
				<div className="collapse-content">
					<div className="space-y-4 pt-2">
						{/* Focus Level */}
						{/* <div className="form-control">
							<label className="label w-full justify-between">
								<span className="label-text text-sm font-medium">
									Focus Level: {focusLevel}
								</span>
								<span className="label-text-alt text-xs text-base-content/60">
									{parseInt(focusLevel) <= 3
										? "Light focus - Easy tasks"
										: parseInt(focusLevel) <= 7
										? "Moderate focus - Regular work"
										: "Deep focus - Complex tasks"}
								</span>
							</label>
							<div className="space-y-2">
								<input
									type="range"
									min="1"
									max="10"
									step="1"
									value={focusLevel}
									onChange={handleFocusLevelChange}
									className="range range-xs w-full"
								/>

								<div className="flex justify-between text-[0.5rem] text-base-content/60">
									<span>|</span>
									<span>|</span>
									<span>|</span>
									<span>|</span>
									<span>|</span>
									<span>|</span>
									<span>|</span>
									<span>|</span>
									<span>|</span>
									<span>|</span>
								</div>

								<div className="flex justify-between text-xs text-base-content/60">
									<span>Light focus</span>
									<span>Deep focus</span>
								</div>
							</div>
						</div> */}

						{/* Tags */}
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
							{renderTags(tags)}
						</div>

						{/* Additional Notes */}
						{/* <div className="form-control">
							<label className="label">
								<span className="label-text text-sm font-medium">
									Additional Notes
								</span>
								<span className="label-text-alt text-xs text-base-content/60">
									Optional context
								</span>
							</label>
							<textarea
								placeholder="Any additional context or reminders..."
								value={additionalNotes}
								onChange={handleAdditionalNotesChange}
								className="textarea textarea-sm w-full bg-base-200 resize-none"
								rows={2}
							/>
						</div> */}
					</div>
				</div>
			</div>

			<div className="card-actions">
				<button
					className={`btn btn-block h-14 transition-all duration-200 relative overflow-hidden ${
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
							<Check className="size-4" />
						) : (
							<Play className="size-4" />
						)}
						<span>
							{isHolding && holdProgress >= 100
								? "Session Starting..."
								: `Hold to Start ${
										activeTab === "planned" ? formatTime(duration) : "Open"
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
	);
}
