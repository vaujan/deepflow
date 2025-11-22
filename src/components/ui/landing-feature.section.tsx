import React from "react";
import {
	Timer,
	CheckSquare,
	BarChart3,
	Zap,
	Brain,
	Coffee,
} from "lucide-react";

export default function LandingFeatureSection() {
	const features = [
		{
			title: "Deep Focus Timer",
			description:
				"Customizable Pomodoro timer with ambient sounds to help you get into the zone instantly.",
			icon: <Timer className="size-6 text-primary" />,
		},
		{
			title: "Task Management",
			description:
				"Organize your tasks with a clean, distraction-free interface designed for deep work.",
			icon: <CheckSquare className="size-6 text-secondary" />,
		},
		{
			title: "Productivity Analytics",
			description:
				"Visualize your focus trends and habits with beautiful heatmaps and charts.",
			icon: <BarChart3 className="size-6 text-accent" />,
		},
		{
			title: "Flow State Triggers",
			description:
				"Scientifically proven audio cues and visual aids to trigger flow state on command.",
			icon: <Zap className="size-6 text-warning" />,
		},
		{
			title: "Distraction Blocking",
			description:
				"Automatically block distracting websites and apps while you are in a focus session.",
			icon: <Brain className="size-6 text-info" />,
		},
		{
			title: "Smart Breaks",
			description:
				"Intelligent break reminders based on your energy levels and focus duration.",
			icon: <Coffee className="size-6 text-success" />,
		},
	];

	return (
		<section className="py-20 px-12 w-full max-w-7xl">
			<div className="text-center mb-16">
				<h2 className="text-4xl font-bold mb-4">
					Everything you need to focus
				</h2>
				<p className="text-xl text-base-content/70 max-w-2xl mx-auto">
					Deepflow combines powerful tools with a calm design to help you
					achieve your best work.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{features.map((feature, index) => (
					<div
						key={index}
						className="p-6 rounded-2xl bg-base-200/50 border border-base-content/5 hover:border-primary/20 transition-all hover:shadow-lg hover:-translate-y-1"
					>
						<div className="w-12 h-12 rounded-xl bg-base-100 flex items-center justify-center mb-4 shadow-sm">
							{feature.icon}
						</div>
						<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
						<p className="text-base-content/70">{feature.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
