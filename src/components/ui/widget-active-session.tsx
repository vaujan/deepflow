"use client";

import React from "react";
import { Timer as TimerIcon } from "lucide-react";
import WidgetFrame from "./widget-frame";
import { useSession } from "@/src/hooks/useSession";

export default function WidgetActiveSession() {
	const { currentSession, isActive, elapsedTime, remainingTime } = useSession();

	if (!isActive || !currentSession) {
		return (
			<WidgetFrame
				title="Timer"
				icon={<TimerIcon className="size-4 text-primary" />}
			>
				<p className="text-sm text-base-content/60">
					No active session yet. Use the Timer to start a focused session.
				</p>
			</WidgetFrame>
		);
	}

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

	return (
		<WidgetFrame
			title="Active Session"
			icon={<TimerIcon className="size-4 text-primary" />}
		>
			<div className="space-y-3">
				<div>
					<h3 className="font-medium text-sm">{currentSession.goal}</h3>
					<p className="text-xs text-base-content/60">
						{currentSession.sessionType} session
					</p>
				</div>

				<div className="text-center">
					<div className="text-2xl font-mono font-bold">
						{formatTime(elapsedTime)}
					</div>
					{remainingTime !== null && (
						<div className="text-xs text-base-content/60">
							{formatTime(remainingTime)} remaining
						</div>
					)}
				</div>

				{currentSession.tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{currentSession.tags.map((tag, index) => (
							<span
								key={index}
								className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</WidgetFrame>
	);
}
