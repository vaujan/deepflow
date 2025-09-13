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

interface EnhancedTagFocusChartProps {
	className?: string;
	period?: Period;
	maxTags?: number;
	// New customization props
	showLabels?: boolean;
	showLegend?: boolean;
	innerRadius?: number;
	outerRadius?: number;
	cornerRadius?: number;
	animationDuration?: number;
}

const EnhancedTagFocusChart: React.FC<EnhancedTagFocusChartProps> = ({
	className = "",
	period = "30d",
	maxTags = 7,
	showLabels = true,
	showLegend = true,
	innerRadius = 60,
	outerRadius = 90,
	cornerRadius = 4,
	animationDuration = 800,
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

	// Enhanced color palette with better contrast
	const slicePalette = [
		radixColorScales.blue.blue9,
		radixColorScales.cyan.cyan9,
		radixColorScales.green.green9,
		radixColorScales.orange.orange9,
		radixColorScales.yellow.yellow9,
		radixColorScales.red.red9,
	];

	// Custom tooltip component
	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-base-200 p-4 rounded-lg shadow-xl border border-base-300">
					<div className="flex items-center gap-2 mb-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: payload[0].payload.fill }}
						/>
						<p className="font-semibold text-base-content">{data.tag}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-base-content/80">
							<strong>{data.totalMinutes}</strong> minutes
						</p>
						<p className="text-sm text-base-content/80">
							<strong>{data.percentage}%</strong> of total time
						</p>
						<p className="text-xs text-base-content/60">
							{data.sessions} sessions
						</p>
					</div>
				</div>
			);
		}
		return null;
	};

	// Custom label component
	const CustomLabel = ({
		name,
		percentage,
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
	}: any) => {
		if (!showLabels || percentage < 5) return null; // Don't show labels for small slices

		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill={radixColorScales.slate.slate12}
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
				className="text-xs font-medium"
			>
				{`${name} ${percentage}%`}
			</text>
		);
	};

	return (
		<div className={`card bg-base-100 p-6 ${className}`}>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-base-content">
					Focus by Tag
				</h3>
				<div className="flex items-center gap-2">
					<span className="text-xs text-base-content/60">
						Top {Math.min(maxTags, data.length)}
					</span>
					<div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
				</div>
			</div>

			<div className="w-full h-80">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							dataKey="totalMinutes"
							nameKey="tag"
							innerRadius={innerRadius}
							outerRadius={outerRadius}
							paddingAngle={2}
							cornerRadius={cornerRadius}
							label={showLabels ? CustomLabel : false}
							labelLine={false}
							animationDuration={animationDuration}
							animationEasing="ease-in-out"
						>
							{data.map((entry, index) => (
								<Cell
									key={`slice-${entry.tag}-${index}`}
									fill={slicePalette[index % slicePalette.length]}
									stroke={radixColorScales.slate.slate12}
									strokeWidth={1}
								/>
							))}
						</Pie>

						<Tooltip content={<CustomTooltip />} />

						{showLegend && (
							<Legend
								verticalAlign="bottom"
								height={36}
								iconType="circle"
								wrapperStyle={{
									fontSize: "12px",
									color: radixColorScales.slate.slate12,
								}}
								formatter={(value, entry) => (
									<span style={{ color: entry.color }}>{value}</span>
								)}
							/>
						)}
					</PieChart>
				</ResponsiveContainer>
			</div>

			{/* Summary stats */}
			<div className="mt-4 pt-4 border-t border-base-200">
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span className="text-base-content/60">Total Time:</span>
						<span className="ml-2 font-semibold">
							{data.reduce((acc, item) => acc + item.totalMinutes, 0)} min
						</span>
					</div>
					<div>
						<span className="text-base-content/60">Tags:</span>
						<span className="ml-2 font-semibold">{data.length}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EnhancedTagFocusChart;
