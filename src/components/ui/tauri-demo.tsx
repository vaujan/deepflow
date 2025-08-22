"use client";

import React, { useState, useEffect } from "react";

// Tauri APIs - only available in desktop environment
let invoke: any, open: any, notification: any, appWindow: any;

// Check if we're in a Tauri environment
if (typeof window !== "undefined" && (window as any).__TAURI__) {
	// In Tauri environment, these APIs will be available globally
	invoke = (window as any).__TAURI__?.invoke;
	open = (window as any).__TAURI__?.dialog?.open;
	notification = (window as any).__TAURI__?.notification;
	appWindow = (window as any).__TAURI__?.window?.appWindow;
}

export default function TauriDemo() {
	const [greeting, setGreeting] = useState("");
	const [selectedFile, setSelectedFile] = useState<string | null>(null);

	useEffect(() => {
		// Example of calling a Rust function
		if (invoke) {
			invoke("greet", { name: "World" }).then((response: any) =>
				setGreeting(response as string)
			);
		}
	}, []);

	const handleFileOpen = async () => {
		if (!open || !notification) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		try {
			const selected = await open({
				multiple: false,
				filters: [
					{
						name: "Text Files",
						extensions: ["txt", "md", "js", "ts", "tsx"],
					},
				],
			});

			if (selected && !Array.isArray(selected)) {
				setSelectedFile(selected);
				await notification.send({
					title: "File Selected",
					body: `Opened: ${selected}`,
					icon: "info",
				});
			}
		} catch (error) {
			console.error("Error opening file:", error);
		}
	};

	const toggleFullscreen = async () => {
		if (!appWindow) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		try {
			const isFullscreen = await appWindow.isFullscreen();
			if (isFullscreen) {
				await appWindow.setFullscreen(false);
			} else {
				await appWindow.setFullscreen(true);
			}
		} catch (error) {
			console.error("Error toggling fullscreen:", error);
			alert("Error toggling fullscreen");
		}
	};

	return (
		<div className="card bg-base-100 shadow-xl p-6">
			<div className="card-body">
				<h2 className="card-title text-primary">Tauri Desktop Features</h2>
				<p className="text-sm text-base-content/70 mb-4">
					This component demonstrates native desktop functionality using Tauri
					APIs.
				</p>

				<div className="space-y-4">
					{/* File Dialog Example */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">File Selection</span>
						</label>
						<div className="flex gap-2">
							<button
								className="btn btn-primary btn-sm"
								onClick={handleFileOpen}
							>
								Open File
							</button>
							{selectedFile && (
								<span className="text-sm text-base-content/70 self-center">
									{selectedFile}
								</span>
							)}
						</div>
					</div>

					{/* Window Controls */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Window Controls</span>
						</label>
						<div className="flex gap-2">
							<button
								className="btn btn-secondary btn-sm"
								onClick={toggleFullscreen}
							>
								Toggle Fullscreen
							</button>
							<button
								className="btn btn-accent btn-sm"
								onClick={() => {
									if (appWindow) {
										appWindow.minimize();
									} else {
										alert("Tauri APIs not available in web environment");
									}
								}}
							>
								Minimize
							</button>
						</div>
					</div>

					{/* System Notification */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">System Notifications</span>
						</label>
						<button
							className="btn btn-info btn-sm w-fit"
							onClick={() => {
								if (notification) {
									notification.send({
										title: "Hello from Tauri!",
										body: "This is a native system notification",
										icon: "success",
									});
								} else {
									alert("Tauri APIs not available in web environment");
								}
							}}
						>
							Send Notification
						</button>
					</div>

					{/* Rust Integration Example */}
					{greeting && (
						<div className="alert alert-success">
							<span>Rust says: {greeting}</span>
						</div>
					)}
				</div>

				<div className="card-actions justify-end mt-4">
					<div className="badge badge-outline">Desktop Only</div>
				</div>
			</div>
		</div>
	);
}
