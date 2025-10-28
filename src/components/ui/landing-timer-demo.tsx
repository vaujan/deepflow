"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Clock, Timer as TimerIcon, Goal, Hash } from "lucide-react";

export default function LandingTimerDemo() {
	const placeholders = [
		"Complete the project proposal...",
		"Read chapter 5 of the book...",
		"Write 500 words for the blog...",
		"Review and fix 3 bugs...",
		"Design the landing page...",
		"Practice piano for 30 minutes...",
	];
	const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [duration, setDuration] = useState(25);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (textareaRef.current) textareaRef.current.blur();
	}, []);

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

	return (
		<div
			className={
				"card border-border h-fit md:bg-transparent w-full p-4 lg:p-6 gap-4 lg:gap-6 flex flex-col"
			}
			data-tour="timer-widget"
		>
			<div className="flex flex-col text-center">
				<h1 className="font-semibold">What will you accomplish today?</h1>
				<p className="text-base-content/50">
					Write down your goal and start a focus session
				</p>
			</div>

			{/* Goal textarea with animated placeholder (read-only) */}
			<div className="flex flex-col space-y-6 pr-2">
				<div className="relative">
					<textarea
						ref={textareaRef}
						id="goal"
						placeholder=""
						value={""}
						readOnly
						className="textarea rounded-box textarea-md bg-base-100/50 backdrop-blur-sm w-full h-24 resize-none"
						style={{
							wordWrap: "break-word",
							overflowWrap: "break-word",
							whiteSpace: "pre-wrap",
							lineHeight: "1.5",
						}}
					/>
					<div className="absolute inset-0 pointer-events-none flex items-start px-4 py-3">
						<div className="h-6 overflow-hidden">
							<div
								className="text-base-content/40 transition-transform duration-500 ease-in-out"
								style={{
									transform: `translateY(-${currentPlaceholderIndex * 1.5}rem)`,
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
				</div>
			</div>

			{/* Tabs (visual only) */}
			<div className="tabs tabs-border">
				<label className="tab font-medium">
					<input type="radio" name="session_tabs_demo" defaultChecked />
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
								onChange={(e) => setDuration(parseInt(e.target.value))}
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
					<input type="radio" name="session_tabs_demo" />
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
			</div>

			{/* Tags collapse (visual only) */}
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
								<div className="flex items-center gap-2">
									<Hash className="size-3 text-base-content/50" />
									<input
										type="text"
										placeholder="blog essay urgent work"
										className="input input-sm w-full bg-base-200"
										readOnly
									/>
								</div>
								<div className="flex flex-wrap gap-1 mt-2">
									<span className="badge badge-sm badge-soft badge-neutral rounded-sm">
										#work
									</span>
									<span className="badge badge-sm badge-soft badge-neutral rounded-sm">
										#urgent
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Start button (disabled) */}
			<div className="card-actions flex-shrink-0">
				<button className="btn btn-block mb-8 h-14 btn-disabled" disabled>
					<Play className="size-4" />
					<span>Start {formatTime(duration)} Session</span>
				</button>
			</div>
		</div>
	);
}
