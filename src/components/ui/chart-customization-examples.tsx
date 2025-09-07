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
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	LineChart,
	Line,
	AreaChart,
	Area,
} from "recharts";
import { radixColorScales } from "../../utils/radixColorMapping";

// Example 1: Customized Pie Chart with different styling
export const CustomPieChart: React.FC = () => {
	const data = useMemo(() => {
		const range = getDateRangeSessions(mockSessions, "30d");
		const tags = computeTagFocus(range).slice(0, 5);
		const total = tags.reduce((acc, t) => acc + t.totalMinutes, 0) || 1;
		return tags.map((t) => ({
			...t,
			percentage: parseFloat(((t.totalMinutes / total) * 100).toFixed(1)),
		}));
	}, []);

	// Custom color palette
	const customColors = [
		radixColorScales.blue.blue9,
		radixColorScales.cyan.cyan9,
		radixColorScales.green.green9,
		radixColorScales.orange.orange9,
		radixColorScales.yellow.yellow9,
	];

	return (
		<div className="card bg-base-100 p-6">
			<h3 className="text-lg font-semibold mb-4">Custom Pie Chart</h3>
			<div className="w-full h-80">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							dataKey="totalMinutes"
							nameKey="tag"
							// Customize donut hole size
							innerRadius={40}
							outerRadius={120}
							// Add padding between slices
							paddingAngle={5}
							// Customize corner radius
							cornerRadius={8}
							// Custom label styling
							label={({ name, percentage }) => (
								<text
									x={0}
									y={0}
									textAnchor="middle"
									dominantBaseline="central"
									className="fill-base-content text-xs font-medium"
								>
									{`${name}\n${percentage}%`}
								</text>
							)}
							// Custom label line styling
							labelLine={false}
						>
							{data.map((entry, index) => (
								<Cell
									key={`slice-${entry.tag}-${index}`}
									fill={customColors[index % customColors.length]}
									// Add hover effects
									stroke={radixColorScales.slate.slate12}
									strokeWidth={2}
								/>
							))}
						</Pie>
						{/* Custom tooltip */}
						<Tooltip
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									const data = payload[0].payload;
									return (
										<div className="bg-base-200 p-3 rounded-lg shadow-lg border">
											<p className="font-semibold">{data.tag}</p>
											<p className="text-sm">
												{data.totalMinutes} min ({data.percentage}%)
											</p>
										</div>
									);
								}
								return null;
							}}
						/>
						{/* Custom legend */}
						<Legend
							verticalAlign="bottom"
							height={36}
							iconType="circle"
							wrapperStyle={{
								fontSize: "12px",
								color: radixColorScales.slate.slate12,
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

// Example 2: Customized Bar Chart
export const CustomBarChart: React.FC = () => {
	const data = useMemo(() => {
		const range = getDateRangeSessions(mockSessions, "30d");
		return computeTagFocus(range).slice(0, 6);
	}, []);

	return (
		<div className="card bg-base-100 p-6">
			<h3 className="text-lg font-semibold mb-4">Custom Bar Chart</h3>
			<div className="w-full h-80">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
					>
						{/* Custom grid */}
						<CartesianGrid
							strokeDasharray="3 3"
							stroke={radixColorScales.slate.slate6}
							vertical={false}
						/>
						<XAxis
							dataKey="tag"
							stroke={radixColorScales.slate.slate11}
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 12 }}
						/>
						<YAxis
							stroke={radixColorScales.slate.slate11}
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 12 }}
						/>
						<Tooltip
							content={({ active, payload, label }) => {
								if (active && payload && payload.length) {
									return (
										<div className="bg-base-200 p-3 rounded-lg shadow-lg border">
											<p className="font-semibold">{label}</p>
											<p className="text-sm">{payload[0].value} minutes</p>
										</div>
									);
								}
								return null;
							}}
						/>
						<Bar
							dataKey="totalMinutes"
							// Gradient fill
							fill="url(#barGradient)"
							radius={[4, 4, 0, 0]}
						/>
						{/* Define gradient */}
						<defs>
							<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={radixColorScales.blue.blue9}
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor={radixColorScales.blue.blue7}
									stopOpacity={0.8}
								/>
							</linearGradient>
						</defs>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

// Example 3: Customized Line Chart
export const CustomLineChart: React.FC = () => {
	const data = useMemo(() => {
		// Generate sample time series data
		const days = 7;
		const today = new Date();
		const arr = [];
		for (let i = days - 1; i >= 0; i--) {
			const day = new Date(today);
			day.setDate(day.getDate() - i);
			arr.push({
				day: day.toLocaleDateString("en-US", { weekday: "short" }),
				focus: Math.floor(Math.random() * 100) + 20,
				sessions: Math.floor(Math.random() * 10) + 1,
			});
		}
		return arr;
	}, []);

	return (
		<div className="card bg-base-100 p-6">
			<h3 className="text-lg font-semibold mb-4">Custom Line Chart</h3>
			<div className="w-full h-80">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke={radixColorScales.slate.slate6}
						/>
						<XAxis
							dataKey="day"
							stroke={radixColorScales.slate.slate11}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke={radixColorScales.slate.slate11}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip
							content={({ active, payload, label }) => {
								if (active && payload && payload.length) {
									return (
										<div className="bg-base-200 p-3 rounded-lg shadow-lg border">
											<p className="font-semibold">{label}</p>
											{payload.map((entry, index) => (
												<p
													key={index}
													className="text-sm"
													style={{ color: entry.color }}
												>
													{entry.name}: {entry.value}
												</p>
											))}
										</div>
									);
								}
								return null;
							}}
						/>
						<Line
							type="monotone"
							dataKey="focus"
							stroke={radixColorScales.blue.blue9}
							strokeWidth={3}
							dot={{ fill: radixColorScales.blue.blue9, strokeWidth: 2, r: 4 }}
							activeDot={{
								r: 6,
								stroke: radixColorScales.blue.blue9,
								strokeWidth: 2,
							}}
						/>
						<Line
							type="monotone"
							dataKey="sessions"
							stroke={radixColorScales.green.green9}
							strokeWidth={3}
							dot={{
								fill: radixColorScales.green.green9,
								strokeWidth: 2,
								r: 4,
							}}
							activeDot={{
								r: 6,
								stroke: radixColorScales.green.green9,
								strokeWidth: 2,
							}}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

// Example 4: Customized Area Chart
export const CustomAreaChart: React.FC = () => {
	const data = useMemo(() => {
		const days = 14;
		const today = new Date();
		const arr = [];
		for (let i = days - 1; i >= 0; i--) {
			const day = new Date(today);
			day.setDate(day.getDate() - i);
			arr.push({
				day: day.getDate(),
				focus: Math.floor(Math.random() * 200) + 50,
			});
		}
		return arr;
	}, []);

	return (
		<div className="card bg-base-100 p-6">
			<h3 className="text-lg font-semibold mb-4">Custom Area Chart</h3>
			<div className="w-full h-80">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
					>
						<defs>
							<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={radixColorScales.blue.blue9}
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor={radixColorScales.blue.blue9}
									stopOpacity={0.05}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke={radixColorScales.slate.slate6}
						/>
						<XAxis
							dataKey="day"
							stroke={radixColorScales.slate.slate11}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke={radixColorScales.slate.slate11}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip
							content={({ active, payload, label }) => {
								if (active && payload && payload.length) {
									return (
										<div className="bg-base-200 p-3 rounded-lg shadow-lg border">
											<p className="font-semibold">Day {label}</p>
											<p className="text-sm">Focus: {payload[0].value} min</p>
										</div>
									);
								}
								return null;
							}}
						/>
						<Area
							type="monotone"
							dataKey="focus"
							stroke={radixColorScales.blue.blue9}
							strokeWidth={2}
							fill="url(#areaGradient)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

// Example 5: Custom Sparkline with different styles
export const CustomSparkline: React.FC<{ data: number[]; color: string }> = ({
	data,
	color,
}) => {
	const chartData = data.map((v, i) => ({ x: i, y: v }));

	return (
		<div className="w-full h-20">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={chartData}
					margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
				>
					<defs>
						<linearGradient id="customSparkGrad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={color} stopOpacity={0.4} />
							<stop offset="95%" stopColor={color} stopOpacity={0.1} />
						</linearGradient>
					</defs>
					<Area
						type="monotone"
						dataKey="y"
						stroke={color}
						fill="url(#customSparkGrad)"
						strokeWidth={3}
						// Add smooth curves
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};
