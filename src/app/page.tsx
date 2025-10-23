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
} from "lucide-react";

export default function LandingPage() {
	const router = useRouter();

	const handleSignIn = () => {
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
				"Organize your thoughts with rich text editing and seamless note-taking experience.",
		},
		{
			icon: <Target className="w-8 h-8 text-primary" />,
			title: "Task Management",
			description:
				"Stay productive with intuitive task tracking and completion management.",
		},
		{
			icon: <Clock className="w-8 h-8 text-primary" />,
			title: "Pomodoro Timer",
			description:
				"Focus better with built-in Pomodoro technique timer for optimal productivity.",
		},
		{
			icon: <Users className="w-8 h-8 text-primary" />,
			title: "Session Tracking",
			description:
				"Monitor your work sessions and analyze your productivity patterns over time.",
		},
	];

	return (
		<div className="min-h-screen bg-base-100">
			{/* Hero Section */}
			<section className="hero min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
				<div className="hero-content text-center max-w-4xl mx-auto px-4">
					<div className="space-y-8">
						<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							Deepflow
						</h1>
						<p className="text-xl md:text-2xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
							Your all-in-one productivity workspace. Organize notes, manage
							tasks, track time, and boost your focus with powerful widgets
							designed for deep work.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
							<button
								onClick={handleSignIn}
								className="btn btn-primary btn-lg px-8 gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
							>
								Sign In
								<ArrowRight className="w-5 h-5" />
							</button>
							<button
								onClick={handleTryAsGuest}
								className="btn btn-outline btn-lg px-8 gap-2 hover:shadow-lg transition-all duration-300"
							>
								Try as Guest
								<ArrowRight className="w-5 h-5" />
							</button>
						</div>
						<div className="flex items-center justify-center gap-2 text-sm text-base-content/60 pt-4">
							<CheckCircle className="w-4 h-4 text-success" />
							<span>No signup required for guest mode</span>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4 bg-base-200/50">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
							Everything you need for
							<span className="text-primary"> productive work</span>
						</h2>
						<p className="text-xl text-base-content/70 max-w-3xl mx-auto">
							Deepflow combines powerful productivity tools in one seamless
							workspace, designed to help you focus and accomplish more.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
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

			{/* CTA Section */}
			<section className="py-20 px-4 bg-primary/5">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
						Ready to boost your productivity?
					</h2>
					<p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
						Join thousands of users who have transformed their workflow with
						Deepflow. Start your journey to better focus and organization today.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<button
							onClick={handleSignIn}
							className="btn btn-primary btn-lg px-8 gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
						>
							Get Started
							<ArrowRight className="w-5 h-5" />
						</button>
						<button
							onClick={handleTryAsGuest}
							className="btn btn-outline btn-lg px-8 gap-2 hover:shadow-lg transition-all duration-300"
						>
							Try Free
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
						Your productivity workspace, reimagined.
					</p>
				</div>
			</footer>
		</div>
	);
}
