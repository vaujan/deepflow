"use client";

import React, { useMemo } from "react";
import { mockSessions } from "../../data/mockSessions";
import {
	computeHourlyFocus,
	findPeakWindow,
	getDateRangeSessions,
	Period,
} from "../../lib/analytics";
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	BarChart,
	Bar,
} from "recharts";
import { radixColorScales } from "../../utils/radixColorMapping";

interface PeakFocusWindowChartProps {
	className?: string;
	period?: Period;
	windowHours?: number; // highlight best N-hour window
}

const colors = {
	primary: radixColorScales.blue.blue9,
	primaryLine: radixColorScales.blue.blue10,
	accent: radixColorScales.cyan.cyan9,
	grid: radixColorScales.slate.slate5,
	text: radixColorScales.slate.slate12,
	highlight: radixColorScales.orange.orange9,
};

const formatHour = (h: number) => `${h}:00`;

const PeakFocusWindowChart: React.FC<PeakFocusWindowChartProps> = ({
	className = "",
	period = "30d",
	windowHours = 3,
}) => {
	const { hourly, best } = useMemo(() => {
		const range = getDateRangeSessions(mockSessions, period);
		const hourly = computeHourlyFocus(range);
		const best = findPeakWindow(hourly, windowHours);
		return { hourly, best };
	}, [period, windowHours]);

	const highlighted = new Set<number>();
	for (let h = best.startHour; h <= best.endHour; h++) highlighted.add(h);

	return (
		<div className={`card bg-base-100 p-4 ${className}`}>
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-sm font-semibold text-base-content">
					Peak Focus Window
				</h3>
				<span className="text-xs text-base-content/60">
					Best {windowHours}h: {formatHour(best.startHour)}–
					{formatHour(best.endHour + 1)}
				</span>
			</div>
			<div className="w-full h-56">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={hourly}
						margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
					>
						<defs>
							<linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={colors.primary}
									stopOpacity={0.45}
								/>
								<stop
									offset="95%"
									stopColor={colors.primary}
									stopOpacity={0.05}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid stroke={colors.grid} vertical={false} />
						<XAxis
							dataKey="hour"
							tickFormatter={formatHour}
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
							labelFormatter={(h) => formatHour(Number(h))}
							formatter={(value: any, name) =>
								name === "totalMinutes" ? [`${value} min`, "Focus Time"] : value
							}
						/>
						<Area
							type="monotone"
							dataKey="totalMinutes"
							stroke={colors.primaryLine}
							fill="url(#primaryGrad)"
							strokeWidth={2}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
			<div className="w-full h-10 mt-2">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={hourly}
						margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
					>
						<XAxis dataKey="hour" hide />
						<YAxis hide />
						<Bar
							dataKey="totalMinutes"
							radius={[2, 2, 0, 0]}
							fill={colors.accent}
							shape={(props: any) => {
								const { x, y, width, height, payload } = props;
								const isHl = highlighted.has(payload.hour);
								return (
									<rect
										x={x}
										y={y}
										width={width}
										height={height}
										fill={isHl ? colors.highlight : colors.accent}
										rx={2}
										ry={2}
									/>
								);
							}}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default PeakFocusWindowChart;
