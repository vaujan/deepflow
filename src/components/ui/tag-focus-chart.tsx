"use client";

import React, { useMemo } from "react";
import { mockSessions } from "../../data/mockSessions";
import {
	computeTagFocus,
	getDateRangeSessions,
	Period,
} from "../../lib/analytics";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { radixColorScales } from "../../utils/radixColorMapping";

interface TagFocusChartProps {
	className?: string;
	period?: Period;
	maxTags?: number;
}

const colors = {
	text: radixColorScales.slate.slate12,
};

const slicePalette = [
	radixColorScales.blue.blue9,
	radixColorScales.cyan.cyan9,
	radixColorScales.green.green9,
	radixColorScales.orange.orange9,
	radixColorScales.yellow.yellow9,
	radixColorScales.red.red9,
	radixColorScales.slate.slate9,
	radixColorScales.gray.gray9,
];

const TagFocusChart: React.FC<TagFocusChartProps> = ({
	className = "",
	period = "30d",
	maxTags = 7,
}) => {
	const data = useMemo(() => {
		const range = getDateRangeSessions(mockSessions, period);
		const tags = computeTagFocus(range).slice(0, maxTags);
		const total = tags.reduce((acc, t) => acc + t.totalMinutes, 0) || 1;
		return tags.map((t) => ({
			...t,
			percentage: parseFloat(((t.totalMinutes / total) * 100).toFixed(1)),
		}));
	}, [period, maxTags]);

	return (
		<div className={`card bg-base-100 p-4 ${className}`}>
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-sm font-semibold text-base-content">
					Focus by Tag
				</h3>
				<span className="text-xs text-base-content/60">
					Top {Math.min(maxTags, data.length)}
				</span>
			</div>
			<div className="w-full h-56">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							dataKey="totalMinutes"
							nameKey="tag"
							innerRadius={60}
							outerRadius={90}
							paddingAngle={2}
							label={({ name, percentage }) => `${name} ${percentage}%`}
						>
							{data.map((entry, index) => (
								<Cell
									key={`slice-${entry.tag}-${index}`}
									fill={slicePalette[index % slicePalette.length]}
								/>
							))}
						</Pie>
						<Tooltip
							formatter={(value: any, name: any, props: any) => {
								const pct = props.payload?.percentage ?? 0;
								return [`${value} min (${pct}%)`, "Focus Time"];
							}}
						/>
						<Legend verticalAlign="bottom" height={24} />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default TagFocusChart;
