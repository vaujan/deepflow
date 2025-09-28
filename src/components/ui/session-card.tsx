"use client";

import { Play, Clock, Timer, Apple } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useSession, Session } from "../../hooks/useSession";
import ActiveSession from "./active-session";
import { usePomodoroSettings } from "../../hooks/usePomodoroSettings";
import SessionCompletion from "./session-completion";

export default function SessionCard() {
	const [duration, setDuration] = useState(25);
	const [focusLevel, setFocusLevel] = useState("5");
	const [goal, setGoal] = useState("");
	const [tags, setTags] = useState("");
	const [additionalNotes, setAdditionalNotes] = useState("");
	const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
	const [activeTab, setActiveTab] = useState<
		"time-boxed" | "open" | "pomodoro"
	>("time-boxed");
	const [completedSession, setCompletedSession] = useState<Session | null>(
		null
	);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Session management
	const {
		currentSession,
		isActive,
		startSession,
		updateDeepWorkQuality,
		updateSessionNotes,
	} = useSession();

	const { settings, updateSettings } = usePomodoroSettings();

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
					<span key={index} className="badge rounded-sm badge-soft badge-sm">
						#{tag}
					</span>
				))}
			</div>
		);
	};

	const handleTabChange = (tab: "time-boxed" | "open" | "pomodoro") => {
		setActiveTab(tab);
		// If switching to Pomodoro, initialize slider with saved setting
		if (tab === "pomodoro") {
			setDuration(settings.pomodoroMinutes || 25);
		}
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
			duration: activeTab !== "open" ? duration : undefined,
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
		<div className="card h-fit md:border border-border md:bg-card shadow-xs min-w-lg w-full xl:max-w-lg p-4 lg:p-6 gap-4 lg:gap-6 overflow-hidden">
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
						checked={activeTab === "time-boxed"}
						onChange={() => handleTabChange("time-boxed")}
					/>
					<Clock className="size-4 me-2" />
					Time-boxed
				</label>
				<div className="tab-content rounded-box border border-border bg-base-200 dark:bg-base-100 p-6">
					{/* Planned Session Mode */}
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
					<Timer className="size-4 me-2" />
					Open
				</label>
				{/* Open content (flow-based) */}
				<div className="tab-content rounded-box border border-border bg-base-200 dark:bg-base-100 p-6">
					{/* Open Session Mode */}
					<div className="space-y-4">
						<div className="flex text-sm justify-between items-center">
							<p className="font-medium">Flow-based session</p>
							<span className="badge rounded-sm badge-soft badge-secondary">
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

				{/* Hiding pomodoro for now */}
				{/* <label className="font-medium tab">
					<input
						type="radio"
						name="session_tabs"
						checked={activeTab === "pomodoro"}
						onChange={() => handleTabChange("pomodoro")}
					/>
					<Apple className="size-4 me-2" />
					Pomodoro
				</label> */}

				{/* Pomodoro content with settings */}
				<div className="tab-content rounded-box border border-border bg-base-200 dark:bg-base-100 p-6">
					<div className="space-y-4">
						<div className="flex text-sm justify-between items-center">
							<p className="font-medium">Pomodoro focus duration</p>
							<span className="badge rounded-sm badge-soft badge-primary">
								Pomodoro
							</span>
						</div>
						<div className="space-y-2">
							<input
								type="range"
								min="15"
								max="60"
								step={5}
								value={duration}
								onChange={handleDurationChange}
								className="range range-sm range-primary w-full"
							/>

							<div className="flex justify-between text-xs text-base-content/60">
								<span>|</span>
								<span>|</span>
								<span>|</span>
								<span>|</span>
							</div>

							<div className="flex justify-between text-xs text-base-content/60">
								<span>15 min</span>
								<span>30 min</span>
								<span>45 min</span>
								<span>60 min</span>
							</div>
						</div>
						<div className="gap-1 flex flex-col">
							<div className="text-xs font-medium mb-1">
								Long Break interval
							</div>
							<input
								type="range"
								min="2"
								max="6"
								step={1}
								value={settings.longBreakInterval}
								onChange={(e) =>
									updateSettings({
										longBreakInterval: parseInt(e.target.value),
									})
								}
								className="range range-xs range-secondary w-full"
							/>

							<div className="flex justify-between text-xs text-base-content/60">
								<span>|</span>
								<span>|</span>
								<span>|</span>
							</div>
							<div className="flex justify-between text-xs text-base-content/60">
								<span>1</span>
								<span>3</span>
								<span>6</span>
							</div>
							<div>{}</div>
						</div>

						{/* Task preferences removed */}
					</div>
				</div>
			</div>

			{/* Optional Inputs Group */}
			<div className="collapse border border-border bg-base-200 dark:bg-base-100">
				<input type="checkbox" className="peer" />
				<div className="collapse-title text-sm font-medium">
					Tags (Optional)
				</div>
				<div className="collapse-content">
					<div className="space-y-4 pt-2">
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
					</div>
				</div>
			</div>

			<div className="card-actions">
				<button
					className={`btn btn-block h-14 transition-all duration-200 ${
						isGoalValid ? "btn-primary" : "btn-disabled"
					}`}
					disabled={!isGoalValid}
					onClick={handleStartSession}
					style={{ touchAction: "manipulation" }}
					aria-disabled={!isGoalValid}
					aria-label="Start focus session"
				>
					<Play className="size-4" />
					<span>
						Start {activeTab === "open" ? "Open" : formatTime(duration)} Session
					</span>
				</button>
			</div>
		</div>
	);
}
