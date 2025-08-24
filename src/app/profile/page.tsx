"use client";

import {
	LogOut,
	Settings,
	User,
	Mail,
	Calendar,
	Shield,
	ArrowLeft,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/ui/sidebar";
import Dock from "@/src/components/ui/dock";

export default function ProfilePage() {
	const router = useRouter();

	const goBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-base-300 flex flex-col lg:flex-row">
			<Sidebar />
			<main className="w-full relative flex flex-col gap-6 flex-1 items-center justify-start">
				{/* Container */}
				<div className="max-w-4xl flex flex-col gap-6 w-full px-8 py-16">
					{/* Header with Back Button */}
					<div className="flex items-center gap-4 mb-8">
						<button onClick={goBack} className="btn btn-ghost btn-circle">
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-3xl font-bold">Profile</h1>
					</div>

					{/* Profile Card */}
					<div className="card bg-base-100 shadow-xl border border-base-300">
						<div className="card-body p-8">
							{/* Avatar and Name Section */}
							<div className="flex flex-col items-center text-center mb-8">
								<div className="avatar avatar-online mb-6">
									<div className="w-32 rounded-full">
										<img
											src="https://img.daisyui.com/images/profile/demo/gordon@192.webp"
											alt="Profile"
										/>
									</div>
								</div>
								<h2 className="text-2xl font-bold text-base-content mb-2">
									Ahmad Fauzan
								</h2>
								<p className="text-lg text-base-content/70">Focus Enthusiast</p>
								<div className="badge badge-success badge-lg mt-3">Online</div>
							</div>

							{/* User Details Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								<div className="flex items-center gap-4 p-4 bg-base-200 rounded-box">
									<div className="w-12 h-12 bg-primary/20 rounded-box flex items-center justify-center">
										<Mail className="w-6 h-6 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-base-content/60 mb-1">Email</p>
										<p className="font-medium text-base-content">
											buildfrombed@gmail.com
										</p>
									</div>
								</div>

								<div className="flex items-center gap-4 p-4 bg-base-200 rounded-box">
									<div className="w-12 h-12 bg-secondary/20 rounded-box flex items-center justify-center">
										<Calendar className="w-6 h-6 text-secondary" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-base-content/60 mb-1">
											Member Since
										</p>
										<p className="font-medium text-base-content">
											January 2024
										</p>
									</div>
								</div>

								<div className="flex items-center gap-4 p-4 bg-base-200 rounded-box">
									<div className="w-12 h-12 bg-accent/20 rounded-box flex items-center justify-center">
										<Shield className="w-6 h-6 text-accent" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-base-content/60 mb-1">
											Account Type
										</p>
										<p className="font-medium text-base-content">Premium</p>
									</div>
								</div>

								<div className="flex items-center gap-4 p-4 bg-base-200 rounded-box">
									<div className="w-12 h-12 bg-info/20 rounded-box flex items-center justify-center">
										<User className="w-6 h-6 text-info" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-base-content/60 mb-1">Status</p>
										<p className="font-medium text-base-content">Active</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<button className="btn btn-outline btn-primary btn-lg">
									<Settings className="w-5 h-5 mr-2" />
									Edit Profile
								</button>
								<button className="btn btn-outline btn-secondary btn-lg">
									<User className="w-5 h-5 mr-2" />
									Account Settings
								</button>
								<button className="btn btn-outline btn-error btn-lg">
									<LogOut className="w-5 h-5 mr-2" />
									Sign Out
								</button>
							</div>
						</div>
					</div>

					{/* Additional Profile Sections */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Statistics Card */}
						<div className="card bg-base-100 shadow-xl border border-base-300">
							<div className="card-body">
								<h3 className="card-title text-lg mb-4">Session Statistics</h3>
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-base-content/70">Total Sessions</span>
										<span className="font-bold text-primary">127</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-base-content/70">Focus Hours</span>
										<span className="font-bold text-secondary">89.5</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-base-content/70">
											Completion Rate
										</span>
										<span className="font-bold text-accent">94%</span>
									</div>
								</div>
							</div>
						</div>

						{/* Preferences Card */}
						<div className="card bg-base-100 shadow-xl border border-base-300">
							<div className="card-body">
								<h3 className="card-title text-lg mb-4">Preferences</h3>
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-base-content/70">
											Default Session Duration
										</span>
										<span className="font-medium">25 minutes</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-base-content/70">
											Focus Level Goal
										</span>
										<span className="font-medium">8/10</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-base-content/70">Notifications</span>
										<span className="font-medium">Enabled</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Dock */}
				<div className="font-medium sticky w-32 bottom-10">
					<Dock />
				</div>
			</main>
		</div>
	);
}
