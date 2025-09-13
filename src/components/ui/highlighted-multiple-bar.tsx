"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import type { TooltipProps } from "recharts";
import { mockSessions } from "../../data/mockSessions";
import { radixColorScales } from "../../utils/radixColorMapping";
import { Loader2 } from "lucide-react";

interface FocusTimeLineChartProps {
	className?: string;
	days?: number;
}

type ChartPoint = {
	label: string;
	minutes: number;
};

const colors = {
	focus: radixColorScales.blue.blue9,
	text: radixColorScales.slate.slate9,
	grid: radixColorScales.slate.slate11,
};

// Loading skeleton component
const ChartLoadingSkeleton: React.FC = () => {
	return (
		<div className="relative w-full h-full">
			{/* Loading indicator */}
			<div className="absolute inset-0 flex items-center justify-center rounded-box border border-border bg-gray-4/50 animate-pulse pointer-events-none">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-base-content/60 font-medium">
						Loading chart data...
					</p>
				</div>
			</div>
		</div>
	);
};

const buildDailyData = (days: number): ChartPoint[] => {
	const today = new Date();
	const points: ChartPoint[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const day = new Date(today);
		day.setDate(day.getDate() - i);
		const start = new Date(day);
		start.setHours(0, 0, 0, 0);
		const end = new Date(day);
		end.setHours(23, 59, 59, 999);

		const sessions = mockSessions.filter(
			(s) => s.startTime >= start && s.startTime <= end
		);
		const totalMinutes = Math.round(
			sessions.reduce((acc, s) => acc + (s.elapsedTime || 0), 0) / 60
		);

		points.push({
			label: day.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
			minutes: totalMinutes,
		});
	}
	return points;
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
	active,
	payload,
	label,
}) => {
	if (!active || !payload || payload.length === 0) return null;
	const minutes = Number(payload[0]?.value ?? 0);
	return (
		<div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-sm">
			<div className="font-medium text-base-content/80">{label}</div>
			<div className="mt-1 flex items-center gap-2">
				<span
					className="inline-block size-2 rounded-sm bg-blue-600"
					style={{ backgroundColor: colors.focus }}
				/>
				<span className="text-base-content/70">Focus Time:</span>
				<span className="font-mono text-base-content">{minutes}m</span>
			</div>
		</div>
	);
};

const FocusTimeLineChart: React.FC<FocusTimeLineChartProps> = ({
	className = "",
	days = 14,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const data = useMemo(() => buildDailyData(days), [days]);

	// If fetching real data, control isLoading via requests; avoid artificial delays.

	if (isLoading) {
		return (
			<div className={`w-full h-full ${className}`}>
				<ChartLoadingSkeleton />
			</div>
		);
	}

	return (
		<div className={`w-full h-full ${className}`}>
			<ResponsiveContainer
				width="100%"
				height="100%"
				className="bg-base-100 rounded-box animate-in fade-in duration-500"
			>
				<AreaChart
					data={data}
					margin={{ top: 24, right: 12, left: 0, bottom: 8 }}
				>
					<defs>
						<linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={colors.focus} stopOpacity={0.4} />
							<stop offset="100%" stopColor={colors.focus} stopOpacity={0.1} />
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeWidth={0.5}
						vertical={false}
						opacity={0.2}
						className="stroke-gray-8"
					/>
					<XAxis
						dataKey="label"
						tickLine={false} // Hide small tick lines
						axisLine={false} // Hide main axis line
						tickMargin={12} // More space between ticks and axis
						className="text-gray-8 font-medium"
						tick={{
							fill: "currentColor", // Use className color
							fontSize: 10,
							fontWeight: 500,
							textAnchor: "middle", // Center text
						}}
					/>
					<YAxis
						tickLine={false} // Hide tick lines
						axisLine={false} // Hide axis line
						tickMargin={24} // Space between ticks and axis
						className="text-gray-8 font-medium"
						tick={{
							fill: "currentColor", // Use className color
							fontSize: 10,
							fontWeight: 500,
							textAnchor: "middle", // Center text
						}}
						domain={[0, "dataMax"]} // Start from 0
						tickCount={6} // Number of ticks
						allowDecimals={false} // No decimal numbers
						tickFormatter={(value) => `${value}m`} // Format as minutes
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={{
							stroke: colors.text,
							strokeWidth: 1,
							strokeOpacity: 0.3,
							strokeDasharray: "4 4",
						}}
					/>
					<Area
						type="linear"
						dataKey="minutes"
						stroke={colors.focus}
						strokeWidth={0.8}
						strokeDasharray="3 3"
						fillOpacity={0.4}
						fill="url(#focusGradient)"
						activeDot={{ r: 3, stroke: colors.focus, strokeWidth: 2 }}
						className="transition-all ease-out"
						isAnimationActive={false}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default FocusTimeLineChart;
