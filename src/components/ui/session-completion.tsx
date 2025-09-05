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
	Trash,
} from "lucide-react";
import { Session } from "../../hooks/useSession";
import { useRouter } from "next/navigation";

interface SessionCompletionProps {
	session: Session;
	onUpdateQuality?: (sessionId: string, quality: number) => void;
	onUpdateNotes?: (sessionId: string, notes: string) => void;
}

export default function SessionCompletion({
	session,
	onUpdateQuality,
	onUpdateNotes,
}: SessionCompletionProps) {
	const router = useRouter();
	const [deepWorkQuality, setDeepWorkQuality] = useState<number>(
		session.deepWorkQuality || 0
	);
	const [hasRated, setHasRated] = useState<boolean>(!!session.deepWorkQuality);
	const [hoverRating, setHoverRating] = useState<number>(0);
	const [notes, setNotes] = useState<string>(session.notes || "");

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
		if (rating === 0) {
			// Reset rating
			setDeepWorkQuality(0);
			setHasRated(false);
			if (onUpdateQuality) {
				onUpdateQuality(session.id, 0);
			}
		} else {
			setDeepWorkQuality(rating);
			setHasRated(true);
			if (onUpdateQuality) {
				onUpdateQuality(session.id, rating);
			}
		}
	};

	const handleNotesChange = (newNotes: string) => {
		setNotes(newNotes);
		if (onUpdateNotes) {
			onUpdateNotes(session.id, newNotes);
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
		if (!session.completionType) return "alert";

		switch (session.completionType) {
			case "premature":
				return "alert alert-soft alert-warning";
			case "overtime":
				return "alert alert-soft alert-info";
			case "completed":
				return "alert alert-soft  alert-success";
			default:
				return "alert";
		}
	};

	const getRatingLabel = (rating: number) => {
		switch (rating) {
			case 1:
				return "Distracted - Mind wandering, easily interrupted";
			case 2:
				return "Poor Focus - Struggling to concentrate";
			case 3:
				return "Below Average - Some focus but inconsistent";
			case 4:
				return "Average - Moderate concentration";
			case 5:
				return "Good - Decent focus maintained";
			case 6:
				return "Above Average - Strong concentration";
			case 7:
				return "Very Good - Deep focus with few distractions";
			case 8:
				return "Excellent - Sustained deep work";
			case 9:
				return "Outstanding - Exceptional focus and flow";
			case 10:
				return "In Flow - Perfect focus, time flies by";
			default:
				return "";
		}
	};

	const getRatingColor = (rating: number) => {
		if (rating <= 3) return "text-error";
		if (rating <= 5) return "text-warning";
		if (rating <= 7) return "text-info";
		return "text-success";
	};

	return (
		<div className="card bg-transparent min-w-lg w-full xl:max-w-lg p-4 lg:p-6 gap-4 lg:gap-6 overflow-hidden">
			{/* Completion Header */}
			<div className="flex flex-col text-center">
				<h1 className="font-semibold">Session Complete</h1>
				<p className="text-base-content/50">{getCompletionMessage()}</p>
			</div>

			{/* Completion Type Indicator - Only for planned sessions */}
			{session.completionType && isPlannedSession && (
				<div className={`${getCompletionTypeColor()} gap-2`}>
					<AlertCircle className="size-4" />
					<span className="text-sm font-medium">
						{getCompletionTypeMessage()}
					</span>
				</div>
			)}

			{/* Session Summary */}
			<div className="flex flex-col gap-4 text-sm bg-card border border-border card rounded-box p-6">
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

				{/* Session Type */}
				<div className="flex align-middle items-center gap-2">
					<Target className="size-4 text-base-content/50" />
					<span className="text-base-content/70">Session Type:</span>
					<span className="font-medium">{getSessionTypeLabel()}</span>
				</div>

				{/* Started time */}
				<div className="flex align-middle items-center gap-2">
					<Clock className="size-4 text-base-content/50" />
					<span className="text-base-content/70">Started:</span>
					<span>{session.startTime.toLocaleTimeString()}</span>
				</div>

				{/* Session Duration */}
				<div className="flex align-middle items-center gap-2">
					<Clock className="size-4 text-base-content/50" />
					<span className="text-base-content/70">Duration:</span>
					<span className="font-medium">
						{Math.round(session.elapsedTime / 60)} minutes
					</span>
				</div>

				{/* Expected End time - Only for planned sessions */}
				{isPlannedSession && (
					<div className="flex align-middle items-center gap-2">
						<Clock className="size-4 text-base-content/50" />
						<span className="text-base-content/70">Expected End:</span>
						<span>
							{session.expectedEndTime
								? session.expectedEndTime.toLocaleTimeString()
								: "-"}
						</span>
					</div>
				)}

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
			<div className="card bg-card border border-border p-6 gap-6">
				<div className="flex flex-col gap-1 text-center">
					<h3 className="font-medium text-base-content w-full text-center">
						Rate Your Deep Work Quality
					</h3>
					<p className="text-sm text-base-content/70">
						How would you rate the quality of your focus during this session?
					</p>
				</div>
				<div className="space-y-4">
					{/* Interactive Star Rating */}
					<div className="flex flex-col items-center gap-3">
						<div className="flex justify-center">
							<div className="rating">
								{Array.from({ length: 10 }, (_, i) => (
									<input
										key={i + 1}
										type="radio"
										name={`rating-${session.id}`}
										className="mask mask-star cursor-pointer"
										checked={deepWorkQuality === i + 1}
										onChange={() => handleQualityRating(i + 1)}
										onMouseEnter={() => setHoverRating(i + 1)}
										onMouseLeave={() => setHoverRating(0)}
									/>
								))}
							</div>
						</div>

						{/* Rating Label Display */}
						{hoverRating > 0 && (
							<div className={`text-center ${getRatingColor(hoverRating)}`}>
								<span className="font-medium text-sm">
									{hoverRating}/10 - {getRatingLabel(hoverRating)}
								</span>
							</div>
						)}
						{!hoverRating && deepWorkQuality > 0 && (
							<div className={`text-center ${getRatingColor(deepWorkQuality)}`}>
								<span className="font-medium text-sm">
									{deepWorkQuality}/10 - {getRatingLabel(deepWorkQuality)}
								</span>
							</div>
						)}
					</div>

					{/* Current Rating Display */}
					{hasRated && (
						<div className="text-center pt-2 border-t border-base-300">
							<p className="text-xs text-base-content/70 mt-mp1">
								Current rating:{" "}
								<button
									className={`font-medium badge badge-sm badge-soft rounded-sm hover:badge-error transition-all duration-200 cursor-pointer group`}
									onClick={() => handleQualityRating(0)}
									title="Reset Rating"
								>
									<span className="group-hover:hidden">
										{deepWorkQuality}/10 - {getRatingLabel(deepWorkQuality)}
									</span>
									<span className="hidden group-hover:inline">
										Reset Rating
									</span>
								</button>
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Additional Notes */}
			<div className="collapse border border-base-100 bg-card">
				<input type="checkbox" className="peer" />
				<div className="collapse-title text-sm font-medium">
					Notes (Optional)
				</div>
				<div className="collapse-content">
					<div className="space-y-4 pt-2">
						<div className="form-control">
							<textarea
								className="textarea w-full min-h-[100px] resize-none"
								placeholder="What went well? What could be improved? Any distractions or breakthroughs?"
								value={notes}
								onChange={(e) => handleNotesChange(e.target.value)}
							/>
							<label className="label">
								<span className="label-text-alt text-xs text-base-content/60">
									Add any thoughts, insights, or observations
								</span>
							</label>
						</div>
					</div>
				</div>
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
		</div>
	);
}
