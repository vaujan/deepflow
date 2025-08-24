import React, { useState } from "react";
import {
	CheckCircle,
	Clock,
	Target,
	Hash,
	TrendingUp,
	Goal,
	Star,
	AlertCircle,
} from "lucide-react";
import { Session } from "../../hooks/useSession";
import { useRouter } from "next/navigation";

interface SessionCompletionProps {
	session: Session;
	onUpdateQuality?: (sessionId: string, quality: number) => void;
}

export default function SessionCompletion({
	session,
	onUpdateQuality,
}: SessionCompletionProps) {
	const router = useRouter();
	const [deepWorkQuality, setDeepWorkQuality] = useState<number>(
		session.deepWorkQuality || 0
	);
	const [hasRated, setHasRated] = useState<boolean>(!!session.deepWorkQuality);

	const isPlannedSession = session.sessionType === "planned";

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

	const handleQualityRating = (rating: number) => {
		setDeepWorkQuality(rating);
		setHasRated(true);
		if (onUpdateQuality) {
			onUpdateQuality(session.id, rating);
		}
	};

	const handleSaveSession = () => {
		// Navigate back to home page
		router.push("/");
	};

	const getCompletionTypeMessage = () => {
		if (!session.completionType) return "";

		switch (session.completionType) {
			case "premature":
				return "Session ended early";
			case "overtime":
				return "Session went over time";
			case "completed":
				return "Session completed on time";
			default:
				return "";
		}
	};

	const getCompletionTypeColor = () => {
		if (!session.completionType) return "text-base-content";

		switch (session.completionType) {
			case "premature":
				return "text-warning";
			case "overtime":
				return "text-info";
			case "completed":
				return "text-success";
			default:
				return "text-base-content";
		}
	};

	return (
		<div className="card max-w-xl w-full border-base-100 border p-6 gap-6">
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
			<div className="flex flex-col gap-4 text-sm bg-base-200 card rounded-box p-6">
				{/* Completion Type Indicator */}
				{session.completionType && (
					<div className="flex items-center gap-2 p-3 bg-base-100 rounded-box border-l-4 border-l-warning">
						<AlertCircle className="size-4 text-warning" />
						<span className={`text-sm font-medium ${getCompletionTypeColor()}`}>
							{getCompletionTypeMessage()}
						</span>
					</div>
				)}

				{/* Goal */}
				<div className="flex flex-1 items-start gap-2">
					<Goal className="size-4 text-base-content/50 mt-0.5 flex-shrink-0" />
					<div className="flex-1 flex flex-col gap-1">
						<span className="text-base-content/70 text-sm">Goal:</span>
						<span
							className="text-base-content font-medium leading-relaxed break-words"
							style={{
								wordWrap: "break-word",
								overflowWrap: "break-word",
								whiteSpace: "pre-wrap",
							}}
						>
							{session.goal}
						</span>
					</div>
				</div>

				{/* Started time */}
				<div className="flex align-middle items-center gap-2">
					<Clock className="size-4 text-base-content/50" />
					<span className="text-base-content/70">Started:</span>
					<span>{session.startTime.toLocaleTimeString()}</span>
				</div>

				{/* Expected End time */}
				<div className="flex align-middle items-center gap-2">
					<Clock className="size-4 text-base-content/50" />
					<span className="text-base-content/70">Expected End:</span>
					<span>
						{isPlannedSession && session.expectedEndTime
							? session.expectedEndTime.toLocaleTimeString()
							: "-"}
					</span>
				</div>

				{/* Actual End time */}
				<div className="flex align-middle items-center gap-2">
					<Clock className="size-4 text-base-content/50" />
					<span className="text-base-content/70">Actual End:</span>
					<span>
						{session.endTime ? session.endTime.toLocaleTimeString() : "-"}
					</span>
				</div>

				{/* Focus level */}
				<div className="flex align-middle items-center gap-2">
					<Target className="size-4 text-base-content/50" />
					<span className="text-base-content/70">Focus Level</span>
					<span>{session.focusLevel}</span>
				</div>

				{/* Tags */}
				{session.tags.length > 0 && (
					<div className="flex items-start gap-2">
						<Hash className="size-4 text-base-content/50 mt-0.5 flex-shrink-0" />
						<div className="flex flex-wrap gap-2">
							{session.tags.map((tag, index) => (
								<span
									key={index}
									className="badge rounded-sm badge-neutral badge-sm"
								>
									#{tag}
								</span>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Deep Work Quality Rating */}
			<div className="bg-base-200 rounded-box p-6">
				<h3 className="font-medium text-base-content mb-4 flex items-center gap-2">
					<Star className="size-5 text-warning" />
					Rate Your Deep Work Quality
				</h3>

				{!hasRated ? (
					<div className="space-y-4">
						<p className="text-sm text-base-content/70 text-center">
							How would you rate the quality of your focus during this session?
						</p>

						{/* DaisyUI Rating Component */}
						<div className="flex justify-center">
							<div className="rating rating-lg">
								{Array.from({ length: 10 }, (_, i) => (
									<input
										key={i + 1}
										type="radio"
										name={`rating-${session.id}`}
										className="mask mask-star-2 bg-orange-400"
										checked={deepWorkQuality === i + 1}
										onChange={() => handleQualityRating(i + 1)}
									/>
								))}
							</div>
						</div>

						<div className="text-center text-xs text-base-content/50">
							<span className="text-warning">1</span> = Poor Focus •{" "}
							<span className="text-warning">10</span> = Excellent Focus
						</div>
					</div>
				) : (
					<div className="text-center">
						<div className="flex justify-center mb-2">
							<div className="rating rating-md">
								{Array.from({ length: 10 }, (_, i) => (
									<input
										key={i + 1}
										type="radio"
										name={`rating-display-${session.id}`}
										className="mask mask-star-2 bg-orange-400"
										checked={deepWorkQuality >= i + 1}
										disabled
									/>
								))}
							</div>
						</div>
						<p className="text-sm text-base-content/70">
							You rated this session:{" "}
							<span className="font-medium text-warning">
								{deepWorkQuality}/10
							</span>
						</p>
						<button
							onClick={() => setHasRated(false)}
							className="btn btn-ghost btn-xs mt-2"
						>
							Change Rating
						</button>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="card-actions justify-center">
				<button
					onClick={handleSaveSession}
					className="btn btn-primary btn-block"
					disabled={!hasRated}
				>
					{hasRated ? "Save Session" : "Rate Session to Continue"}
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
