import React from "react";
import { CheckCircle, Clock, Target, Hash, TrendingUp } from "lucide-react";
import { Session } from "../../hooks/useSession";
import { useRouter } from "next/navigation";

interface SessionCompletionProps {
	session: Session;
}

export default function SessionCompletion({ session }: SessionCompletionProps) {
	const router = useRouter();

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		}
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	};

	const getSessionTypeLabel = () => {
		return session.sessionType === "planned"
			? "Time-boxed Session"
			: "Flow Session";
	};

	const getCompletionMessage = () => {
		if (session.sessionType === "planned") {
			return "Great job! You completed your planned focus session.";
		}
		return "Excellent work! You finished your flow session.";
	};

	const handleSaveSession = () => {
		// Navigate back to home page
		router.push("/home");
	};

	return (
		<div className="card max-w-xl w-full border-base-100 border bg-transparent p-6 gap-6">
			{/* Completion Header */}
			<div className="flex flex-col text-center items-center gap-3">
				<div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
					<CheckCircle className="size-8 text-success" />
				</div>
				<h1 className="font-semibold text-xl text-success">
					Session Complete!
				</h1>
				<p className="text-base-content/70 text-sm">{getCompletionMessage()}</p>
			</div>

			{/* Session Summary */}
			<div className="bg-base-100/50 backdrop-blur-sm rounded-box p-4 border border-base-200 space-y-4">
				<h3 className="font-medium text-base-content/70 mb-3">
					Session Summary
				</h3>

				{/* Goal */}
				<div className="flex items-start gap-3">
					<Target className="size-5 text-primary mt-0.5 flex-shrink-0" />
					<div className="flex-1">
						<p className="text-sm text-base-content/60 mb-1">Goal</p>
						<p className="text-base-content font-medium">{session.goal}</p>
					</div>
				</div>

				{/* Duration */}
				<div className="flex items-center gap-3">
					<Clock className="size-5 text-secondary mt-0.5" />
					<div className="flex-1">
						<p className="text-sm text-base-content/60 mb-1">Duration</p>
						<p className="text-base-content font-medium">
							{formatTime(session.elapsedTime)}
						</p>
					</div>
				</div>

				{/* Session Type */}
				<div className="flex items-center gap-3">
					<TrendingUp className="size-5 text-accent mt-0.5" />
					<div className="flex-1">
						<p className="text-sm text-base-content/60 mb-1">Session Type</p>
						<p className="text-base-content font-medium">
							{getSessionTypeLabel()}
						</p>
					</div>
				</div>

				{/* Focus Level */}
				<div className="flex items-center gap-3">
					<div className="size-5 rounded-full bg-secondary flex items-center justify-center">
						<span className="text-xs font-bold text-secondary-content">
							{session.focusLevel}
						</span>
					</div>
					<div className="flex-1">
						<p className="text-sm text-base-content/60 mb-1">Focus Level</p>
						<p className="text-base-content font-medium">
							{session.focusLevel}/10
						</p>
					</div>
				</div>

				{/* Tags */}
				{session.tags.length > 0 && (
					<div className="flex items-start gap-3">
						<Hash className="size-5 text-base-content/50 mt-0.5 flex-shrink-0" />
						<div className="flex-1">
							<p className="text-sm text-base-content/60 mb-1">Tags</p>
							<div className="flex flex-wrap gap-2">
								{session.tags.map((tag, index) => (
									<span
										key={index}
										className="badge rounded-sm badge-secondary badge-sm"
									>
										#{tag}
									</span>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="card-actions justify-center">
				<button
					onClick={handleSaveSession}
					className="btn btn-primary btn-block"
				>
					Save Session
				</button>
			</div>

			{/* Motivational Message */}
			<div className="text-center text-sm text-base-content/60">
				<p>
					Keep up the great work! Consistency is key to building lasting focus
					habits.
				</p>
			</div>
		</div>
	);
}
