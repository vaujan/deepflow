"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface SparklineRechartsProps {
	data: number[];
	color: string;
	height?: number;
	className?: string;
}

const SparklineRecharts: React.FC<SparklineRechartsProps> = ({
	data,
	color,
	height = 96,
	className = "",
}) => {
	const chartData = data.map((v, i) => ({ x: i, y: v }));
	return (
		<div className={`w-full ${className}`} style={{ height }}>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={chartData}
					margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
				>
					<defs>
						<linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={color} stopOpacity={0.35} />
							<stop offset="95%" stopColor={color} stopOpacity={0.05} />
						</linearGradient>
					</defs>
					<Area
						type="monotone"
						dataKey="y"
						stroke={color}
						fill="url(#sparkGrad)"
						strokeWidth={2}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default SparklineRecharts;
