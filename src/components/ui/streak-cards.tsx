"use client";

import React, { useMemo } from "react";
import { mockSessions } from "../../data/mockSessions";
import {
	computeStreaks,
	getDateRangeSessions,
	Period,
} from "../../lib/analytics";
import { Flame, Trophy } from "lucide-react";
import { radixColorScales } from "../../utils/radixColorMapping";

interface StreakCardsProps {
	className?: string;
	period?: Period; // used for visual emphasis but streaks are all-time
}

const colors = {
	flame: radixColorScales.orange.orange9,
	trophy: radixColorScales.green.green9,
};

const Card: React.FC<{
	icon: React.ReactNode;
	title: string;
	value: string;
	subtitle?: string;
	color: string;
}> = ({ icon, title, value, subtitle, color }) => (
	<div className="card transition-all ease-out w-full bg-card border-border border p-3">
		<div className="flex items-center gap-3">
			<div className="p-2 rounded-md" style={{ backgroundColor: `${color}22` }}>
				{icon}
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-base-content/60">{title}</span>
				<span className="text-2xl font-bold text-base-content leading-tight">
					{value}
				</span>
				{subtitle && (
					<span className="text-xs text-base-content/50">{subtitle}</span>
				)}
			</div>
		</div>
	</div>
);

const StreakCards: React.FC<StreakCardsProps> = ({
	className = "",
	period = "30d",
}) => {
	// period not used for calculation, but we keep prop symmetry with other KPIs
	const stats = useMemo(() => computeStreaks(mockSessions), []);

	return (
		<div className={`grid grid-cols-2 gap-3 ${className}`}>
			<Card
				icon={<Flame className="size-5" color={colors.flame} />}
				title="Current Streak"
				value={`${stats.currentStreakDays} days`}
				subtitle="Consecutive active days"
				color={colors.flame}
			/>
			<Card
				icon={<Trophy className="size-5" color={colors.trophy} />}
				title="Best Streak"
				value={`${stats.longestStreakDays} days"`}
				subtitle="All-time longest run"
				color={colors.trophy}
			/>
		</div>
	);
};

export default StreakCards;
