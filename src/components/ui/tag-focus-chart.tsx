"use client";

import React, { useMemo } from "react";
import { mockSessions } from "../../data/mockSessions";
import {
	computeTagFocus,
	getDateRangeSessions,
	Period,
} from "../../lib/analytics";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { radixColorScales } from "../../utils/radixColorMapping";

interface TagFocusChartProps {
	className?: string;
	period?: Period;
	maxTags?: number;
}

const colors = {
	primary: radixColorScales.blue.blue9,
	grid: radixColorScales.slate.slate5,
	text: radixColorScales.slate.slate12,
};

const TagFocusChart: React.FC<TagFocusChartProps> = ({
	className = "",
	period = "30d",
	maxTags = 7,
}) => {
	const data = useMemo(() => {
		const range = getDateRangeSessions(mockSessions, period);
		const tags = computeTagFocus(range).slice(0, maxTags);
		return tags;
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
					<BarChart
						data={data}
						margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
					>
						<CartesianGrid stroke={colors.grid} vertical={false} />
						<XAxis
							dataKey="tag"
							stroke={colors.text}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke={colors.text}
							tickLine={false}
							axisLine={false}
							width={36}
						/>
						<Tooltip
							formatter={(value: any, name) =>
								name === "totalMinutes" ? [`${value} min`, "Focus Time"] : value
							}
						/>
						<Bar
							dataKey="totalMinutes"
							fill={colors.primary}
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default TagFocusChart;
