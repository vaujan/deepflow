"use client";

import { Play, Clock, Timer, Target } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

export default function SessionCard() {
	const [duration, setDuration] = useState(25);
	const [focusLevel, setFocusLevel] = useState("2");
	const [goal, setGoal] = useState("");
	const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const placeholders = [
		"e.g., Complete the project proposal...",
		"e.g., Read chapter 5 of the book...",
		"e.g., Write 500 words for the blog...",
		"e.g., Review and fix 3 bugs...",
		"e.g., Design the landing page...",
		"e.g., Practice piano for 30 minutes...",
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

	const handleFocusLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFocusLevel(e.target.value);
	};

	const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setGoal(e.target.value);
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

	const isGoalValid = goal.trim().length > 0;
	const goalPreview = goal.trim().slice(0, 30);

	return (
		<div className="card max-w-xl w-full border-base-100 border bg-transparent p-6 gap-8">
			<div className="flex flex-col text-center">
				<h1 className="font-semibold">What will you accomplish today?</h1>
				<p className="text-base-content/50">
					Choose duration and start a focus session
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
						className={`textarea rounded-box textarea-md bg-base-100/50 backdrop-blur-sm w-full h-24 resize-none transition-all duration-200 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 ${
							!isGoalValid && goal.length > 0 ? "textarea-error" : ""
						}`}
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
					<div className="flex justify-start items-center text-xs text-base-content/60">
						<span>{goal.length}/200 characters</span>
					</div>
				)}
			</div>

			{/* Session Mode Tabs */}
			<div className="tabs tabs-border">
				<label className="tab font-medium">
					<input type="radio" name="session_tabs" defaultChecked />
					<Clock className="size-4 me-2" />
					Planned Session
				</label>
				<div className="tab-content rounded-box bg-base-100 p-6">
					{/* Planned Session Mode */}
					<div className="space-y-4">
						<div className="flex text-sm justify-between items-center">
							<p className="font-medium">Duration: {formatTime(duration)}</p>
							<span className="badge rounded-box bg-primary/20 text-primary border-primary/30">
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
								className="range range-sm range-primary w-full"
							/>
							<div className="flex justify-between text-xs text-base-content/60">
								<span>5 min</span>
								<span>60 min</span>
								<span>120 min</span>
							</div>
						</div>
						<p className="text-xs text-base-content/60">
							Session will automatically end after {formatTime(duration)}
						</p>
					</div>
				</div>

				<label className="font-medium tab">
					<input type="radio" name="session_tabs" />
					<Timer className="size-4 me-2" />
					Open Session
				</label>
				<div className="tab-content rounded-box bg-base-100 p-6">
					{/* Open Session Mode */}
					<div className="space-y-4">
						<div className="flex text-sm justify-between items-center">
							<p className="font-medium">Flow-based session</p>
							<span className="badge rounded-box bg-secondary/20 text-secondary border-secondary/30">
								No time limit
							</span>
						</div>
						<div className="bg-base-200 p-3 rounded-box text-center">
							<p className="text-sm text-base-content/70">
								Start when ready, end when you naturally complete your task
							</p>
						</div>
						<p className="text-xs text-base-content/60">
							Timer will count up from zero until you manually stop
						</p>
					</div>
				</div>
			</div>

			<select
				value={focusLevel}
				onChange={handleFocusLevelChange}
				className="select w-full"
			>
				<option disabled={true}>Your focus level</option>
				<option value="1">1 - Light focus</option>
				<option value="2">2 - Moderate focus</option>
				<option value="3">3 - Deep focus</option>
			</select>

			<div className="card-actions">
				<button
					className={`btn btn-block transition-all duration-200 ${
						isGoalValid ? "btn-neutral hover:scale-[1.02]" : "btn-disabled"
					}`}
					disabled={!isGoalValid}
				>
					<Play className="size-4 text-primary" />
					Start {duration ? `${formatTime(duration)}` : "Open"} Session
				</button>
			</div>
		</div>
	);
}
