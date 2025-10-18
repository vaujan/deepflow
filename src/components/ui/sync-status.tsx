"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	Check,
	Clock,
	AlertCircle,
	FileText,
	Timer,
	CheckSquare,
	Bookmark,
	Calendar,
	Play,
	Github,
	Sparkles,
} from "lucide-react";
import { useSyncStatus } from "@/src/hooks/useSyncStatus";

interface SyncItem {
	id: string;
	name: string;
	type:
		| "note"
		| "session"
		| "task"
		| "bookmark"
		| "calendar"
		| "video"
		| "github"
		| "page";
	status: "synced" | "syncing" | "failed" | "pending";
	lastSync?: Date;
	icon: string; // Icon component name
}

interface SyncStatusProps {
	className?: string;
}

const getStatusIcon = (status: SyncItem["status"]) => {
	switch (status) {
		case "synced":
			return <Check className="size-3 text-green-500" />;
		case "syncing":
			return <Clock className="size-3 text-blue-500 animate-spin" />;
		case "failed":
			return <AlertCircle className="size-3 text-red-500" />;
		case "pending":
			return <Clock className="size-3 text-yellow-500" />;
	}
};

const getItemIcon = (item: SyncItem) => {
	const iconClass = "size-4 flex-shrink-0";

	switch (item.type) {
		case "note":
			return <FileText className={`${iconClass} text-slate-400`} />;
		case "session":
			return <Timer className={`${iconClass} text-blue-400`} />;
		case "task":
			return <CheckSquare className={`${iconClass} text-white`} />;
		case "bookmark":
			return <Bookmark className={`${iconClass} text-slate-400`} />;
		case "page":
			return <Sparkles className={`${iconClass} text-blue-400`} />;
		case "video":
			return <Play className={`${iconClass} text-red-500`} />;
		case "github":
			return <Github className={`${iconClass} text-slate-400`} />;
		case "calendar":
			return <Calendar className={`${iconClass} text-slate-400`} />;
		default:
			return <FileText className={`${iconClass} text-slate-400`} />;
	}
};

const formatTimeAgo = (date: Date): string => {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return "Just now";
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
	return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const getOverallSyncStatus = (
	items: SyncItem[],
	isOnline: boolean
): "green" | "yellow" | "red" => {
	// Red: Offline or any failed items
	if (!isOnline || items.some((item) => item.status === "failed")) {
		return "red";
	}

	// Yellow: Some items are syncing or pending
	if (
		items.some((item) => item.status === "syncing" || item.status === "pending")
	) {
		return "yellow";
	}

	// Green: All items synced or no items to sync
	return "green";
};

const getStatusColor = (status: "green" | "yellow" | "red") => {
	switch (status) {
		case "green":
			return "bg-green-500";
		case "yellow":
			return "bg-yellow-500";
		case "red":
			return "bg-red-500";
	}
};

export default function SyncStatus({ className = "" }: SyncStatusProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Use real sync status data
	const {
		items: syncItems,
		isOnline,
		syncedCount,
		totalCount,
		lastGlobalSync,
		isLoading,
	} = useSyncStatus();

	// Determine overall sync status
	const overallStatus = getOverallSyncStatus(syncItems, isOnline);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			{/* Simplified Sync Status Dot */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="btn btn-xs btn-ghost"
				aria-label={`Sync status: ${overallStatus}`}
				aria-expanded={isOpen}
			>
				<div
					className={`w-2 h-2 rounded-full ${getStatusColor(
						overallStatus
					)} shadow-sm`}
				/>
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div className="absolute right-0 top-full mt-2 w-80 bg-base-300 border border-border rounded-lg shadow-xl z-50 backdrop-blur-sm">
					<div className="p-4">
						{/* Header */}
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-base font-medium text-base-content">
								Sync status
							</h3>
							<div className="flex items-center gap-2">
								<div
									className={`w-2 h-2 rounded-full ${getStatusColor(
										overallStatus
									)}`}
								/>
								<span className="text-xs text-base-content/60 capitalize">
									{overallStatus}
								</span>
							</div>
						</div>

						{/* Progress Summary */}
						<div className="mb-4">
							<div className="flex justify-between text-sm text-base-content/70">
								<span>{syncedCount} synced</span>
								<span>{totalCount} total</span>
							</div>
						</div>

						{/* Sync Items List */}
						<div className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-base-content/20 scrollbar-track-transparent">
							{syncItems.length > 0 ? (
								syncItems.map((item) => (
									<div
										key={item.id}
										className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-base-content/5 transition-colors cursor-pointer"
										role="listitem"
									>
										{getItemIcon(item)}
										<div className="flex-1 min-w-0">
											<p className="text-sm text-base-content truncate">
												{item.name}
											</p>
										</div>
										<div className="flex items-center gap-2">
											{item.lastSync && (
												<span className="text-xs text-base-content/50">
													{formatTimeAgo(item.lastSync)}
												</span>
											)}
											{getStatusIcon(item.status)}
										</div>
									</div>
								))
							) : (
								<div className="flex items-center justify-center py-8 text-base-content/50">
									<div className="text-center">
										<div className="size-8 mx-auto mb-2 opacity-50 rounded-full border-2 border-base-content/20 border-t-base-content/60 animate-spin" />
										<p className="text-sm">No items to sync</p>
									</div>
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="mt-4 pt-3 border-t border-border">
							<div className="text-xs text-base-content/60">
								<span>
									{isOnline ? "All systems operational" : "Offline mode"}
								</span>
								{lastGlobalSync && (
									<span className="ml-2">
										• Last sync: {formatTimeAgo(lastGlobalSync)}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
