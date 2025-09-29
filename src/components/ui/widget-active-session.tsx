"use client";

import React from "react";
import { Timer as TimerIcon } from "lucide-react";
import WidgetFrame from "./widget-frame";
import ActiveSession from "./active-session";
import { useSession } from "@/src/hooks/useSession";

export default function WidgetActiveSession() {
	const { currentSession, isActive } = useSession();

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

	return (
		<WidgetFrame
			title="Timer"
			icon={<TimerIcon className="size-4 text-primary" />}
		>
			<ActiveSession session={currentSession} onSessionComplete={() => {}} />
		</WidgetFrame>
	);
}
