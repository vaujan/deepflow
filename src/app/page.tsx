"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
	ArrowRight,
	CheckCircle,
	Clock,
	FileText,
	Target,
	Users,
	TrendingUp,
	Calendar,
	BarChart3,
	Brain,
	Heart,
} from "lucide-react";

export default function LandingPage() {
	const router = useRouter();

	const handleJoinEarlyAccess = () => {
		router.push("/login");
	};

	const handleTryAsGuest = () => {
		router.push("/home");
	};

	const features = [
		{
			icon: <FileText className="w-8 h-8 text-primary" />,
			title: "Smart Notes",
			description:
				"Capture thoughts with rich text editing that feels natural and distraction-free.",
		},
		{
			icon: <Target className="w-8 h-8 text-primary" />,
			title: "Task Management",
			description:
				"Organize your work with gentle structure that supports your natural flow.",
		},
		{
			icon: <Clock className="w-8 h-8 text-primary" />,
			title: "Flow Sessions",
			description:
				"Focus deeply with time blocks that respect your energy and attention.",
		},
		{
			icon: <Users className="w-8 h-8 text-primary" />,
			title: "Session Tracking",
			description:
				"Understand your patterns without judgment, just gentle awareness.",
		},
	];

	const flowTrinity = [
		{
			icon: <Brain className="w-6 h-6 text-primary" />,
			title: "Flow Sessions",
			description: "Focus deeply with structure that feels natural.",
		},
		{
			icon: <Heart className="w-6 h-6 text-primary" />,
			title: "Flow Log",
			description: "Note distractions and urges without judgment.",
		},
		{
			icon: <TrendingUp className="w-6 h-6 text-primary" />,
			title: "Flow Insights",
			description: "Spot patterns that shape your best work days.",
		},
	];

	const statsFeatures = [
		{
			icon: <Calendar className="w-6 h-6 text-primary" />,
			title: "Activity Heat Map",
			description: "See your focus patterns across days and weeks.",
		},
		{
			icon: <TrendingUp className="w-6 h-6 text-primary" />,
			title: "Focus Streaks",
			description: "Track your consistency without pressure.",
		},
		{
			icon: <BarChart3 className="w-6 h-6 text-primary" />,
			title: "Peak Windows",
			description: "Discover when you do your best work.",
		},
	];

	return (
		<div className="min-h-screen bg-base-100">
			{/* Hero Section */}
			<section
				className="hero min-h-screen"
				style={{
					backgroundImage: "url('/login background.png')",
				}}
			>
				<div className="hero-overlay bg-base-100/50 backdrop-blur-xs"></div>
				<div className="hero-content text-center max-w-4xl mx-auto px-4">
					<div className="space-y-12 ">
						<h1 className="text-3xl md:text-4xl font-bold text-base-content">
							Focus hits different when it feels effortless.
						</h1>
						<p className="text-lg md:text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
							Deepflow helps you protect your time, track your focus, and stay
							in flow — without the noise.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
							<button
								onClick={handleJoinEarlyAccess}
								className="btn btn-primary btn-lg px-8 gap-2"
							>
								Join Early Access
								<ArrowRight className="w-5 h-5" />
							</button>
							<button
								onClick={handleTryAsGuest}
								className="btn btn-outline btn-lg px-8 gap-2"
							>
								Take a Tour
								<ArrowRight className="w-5 h-5" />
							</button>
						</div>
						<div className="flex items-center justify-center gap-2 text-sm text-base-content/60 pt-4">
							<CheckCircle className="w-4 h-4 text-success" />
							<span>Walk through the interface with our guided tour</span>
						</div>

						{/* Browser Mockup with Hero Screenshot */}
						<div className="mx-auto">
							<div className="mockup-browser border-base-300 border bg-base-100 shadow-2xl">
								<div className="mockup-browser-toolbar"></div>
								<div className="bg-base-200 flex justify-center">
									<img
										src="/hero screenshot.png"
										alt="Deepflow app interface showing timer, notes, and tasks"
										className="w-full max-w-full h-auto"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Problem Section */}
			<section className="py-24 px-4 bg-base-200/30">
				<div className="max-w-4xl mx-auto text-center">
					<div className="space-y-8">
						<blockquote className="text-2xl md:text-3xl font-medium text-base-content/90 italic">
							"You don't need more productivity hacks.
							<br />
							You need space to actually think."
						</blockquote>
						{/* <div className="text-lg text-base-content/70 max-w-2xl mx-auto">
							<p className="mb-6">
								Most tools push you to do more — faster.
								<br />
								Deepflow helps you slow down, so you can go deeper.
							</p>
							<div className="space-y-3 text-left max-w-md mx-auto">
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-primary rounded-full"></div>
									<span>Endless context-switching</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-primary rounded-full"></div>
									<span>Feeling "busy" but never in control</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-primary rounded-full"></div>
									<span>Motivation that burns out faster than it builds</span>
								</div>
							</div>
						</div> */}
						{/* <div className="pt-8">
							<p className="text-lg text-base-content/80">
								We built Deepflow for people who want to protect their focus —
								not perform it.
							</p>
						</div> */}
					</div>
				</div>
			</section>

			{/* Solution Section */}
			<section className="py-24 px-4 bg-base-100">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
							Deepflow brings calm to your workflow.
						</h2>
					</div>

					{/* Flow Trinity */}
					{/* <div className="mb-16">
						<div className="text-center mb-12">
							<h3 className="text-2xl font-semibold text-base-content mb-4">
								No gamification. Just flow.
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{flowTrinity.map((item, index) => (
								<div
									key={index}
									className="text-center p-6 bg-base-200/50 rounded-lg border border-base-300"
								>
									<div className="flex justify-center mb-4">{item.icon}</div>
									<h4 className="text-lg font-semibold mb-3 text-base-content">
										{item.title}
									</h4>
									<p className="text-base-content/70 leading-relaxed">
										{item.description}
									</p>
								</div>
							))}
						</div>
					</div> */}

					{/* Technical Features */}
					<div className="text-center mb-12">
						<h3 className="text-2xl font-semibold text-base-content mb-4">
							Built for deep work
						</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="card bg-base-100 border border-base-300"
							>
								<div className="card-body text-center p-6">
									<div className="flex justify-center mb-4">{feature.icon}</div>
									<h3 className="card-title text-lg font-semibold mb-3 justify-center">
										{feature.title}
									</h3>
									<p className="text-base-content/70 text-sm leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stats Preview Section */}
			<section className="py-24 px-4 bg-base-200/30">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
							Track patterns, not performance
						</h2>
						<p className="text-xl text-base-content/70 max-w-3xl mx-auto">
							Insights that help you meet yourself again.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{statsFeatures.map((stat, index) => (
							<div
								key={index}
								className="text-center p-6 bg-base-100 rounded-lg border border-base-300"
							>
								<div className="flex justify-center mb-4">{stat.icon}</div>
								<h3 className="text-lg font-semibold mb-3 text-base-content">
									{stat.title}
								</h3>
								<p className="text-base-content/70 leading-relaxed">
									{stat.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Philosophy Section */}
			<section className="py-24 px-4 bg-base-100">
				<div className="max-w-4xl mx-auto text-center">
					<div className="space-y-8">
						<blockquote className="text-2xl md:text-3xl font-medium text-base-content/90 italic">
							"We don't track your time to measure you.
							<br />
							We track it to help you meet yourself again."
						</blockquote>
						<p className="text-lg text-base-content/70">
							Deepflow is designed for makers, writers, and thinkers
							<br />
							who care more about clarity than hustle.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 px-4 bg-base-200/30">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
						Protect your focus.
					</h2>
					<p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
						Join Deepflow early access.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<button
							onClick={handleJoinEarlyAccess}
							className="btn btn-primary btn-lg px-8 gap-2"
						>
							Join Early Access
							<ArrowRight className="w-5 h-5" />
						</button>
						<button
							onClick={handleTryAsGuest}
							className="btn btn-outline btn-lg px-8 gap-2"
						>
							Take a Tour
							<ArrowRight className="w-5 h-5" />
						</button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="footer footer-center p-10 bg-base-200 text-base-content">
				<div>
					<p className="font-bold text-lg">Deepflow</p>
					<p className="text-base-content/70">
						Your focus is sacred. Treat it that way.
					</p>
				</div>
			</footer>
		</div>
	);
}
