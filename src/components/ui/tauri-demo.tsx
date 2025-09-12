"use client";

import React, { useState, useEffect } from "react";

// Check if we're in a Tauri environment
const isTauriEnvironment =
	typeof window !== "undefined" && (window as any).__TAURI__;

// Get Tauri APIs from global object
const getTauriAPIs = () => {
	if (!isTauriEnvironment) return null;

	const tauri = (window as any).__TAURI__;
	return {
		invoke: tauri?.invoke,
		open: tauri?.dialog?.open,
		save: tauri?.dialog?.save,
		notification: tauri?.notification,
		appWindow: tauri?.window?.appWindow,
		path: tauri?.path,
		fs: tauri?.fs,
		os: tauri?.os,
		process: tauri?.process,
		shell: tauri?.shell,
		clipboard: tauri?.clipboard,
	};
};

// Debug function to check what's available
const debugTauriAPIs = () => {
	console.log("Tauri Debug Info:");
	console.log("Window object:", typeof window);
	console.log("__TAURI__ exists:", !!(window as any).__TAURI__);
	console.log("__TAURI__ object:", (window as any).__TAURI__);
	console.log("isTauriEnvironment:", isTauriEnvironment);

	const apis = getTauriAPIs();
	if (apis) {
		console.log(
			"Available APIs:",
			Object.keys(apis).filter((key) => apis[key as keyof typeof apis])
		);
	}
};

export default function TauriDemo() {
	const [greeting, setGreeting] = useState("");
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [fileContent, setFileContent] = useState<string>("");
	const [systemInfo, setSystemInfo] = useState<any>(null);
	const [clipboardText, setClipboardText] = useState("");
	const [notificationPermission, setNotificationPermission] =
		useState<string>("unknown");

	useEffect(() => {
		// Debug Tauri APIs
		debugTauriAPIs();

		if (!isTauriEnvironment) return;

		const apis = getTauriAPIs();
		if (!apis) return;

		// Example of calling a Rust function
		if (apis.invoke) {
			apis
				.invoke("greet", { name: "World" })
				.then((response: any) => setGreeting(response as string))
				.catch(console.error);
		}

		// Get system information
		if (apis.os && apis.process) {
			Promise.all([
				apis.os.platform(),
				apis.os.arch(),
				apis.os.version(),
				apis.process.version(),
			])
				.then(([platformName, archName, osVersion, nodeVersion]) => {
					setSystemInfo({
						platform: platformName,
						arch: archName,
						osVersion,
						nodeVersion,
					});
				})
				.catch(console.error);
		}

		// Check notification permission
		if (apis.notification) {
			apis.notification
				.isPermissionGranted()
				.then((granted: boolean) => {
					setNotificationPermission(granted ? "granted" : "denied");
				})
				.catch(console.error);
		}
	}, []);

	const handleFileOpen = async () => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.open || !apis?.fs || !apis?.notification) {
			alert("Required Tauri APIs not available");
			return;
		}

		try {
			const selected = await apis.open({
				multiple: false,
				filters: [
					{
						name: "Text Files",
						extensions: ["txt", "md", "js", "ts", "tsx", "json"],
					},
				],
			});

			if (selected && !Array.isArray(selected)) {
				setSelectedFile(selected);

				// Read file content
				const content = await apis.fs.readTextFile(selected);
				setFileContent(content);

				await apis.notification.send({
					title: "File Selected",
					body: `Opened: ${selected}`,
					icon: "info",
				});
			}
		} catch (error) {
			console.error("Error opening file:", error);
		}
	};

	const handleFileSave = async () => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.save || !apis?.fs || !apis?.notification) {
			alert("Required Tauri APIs not available");
			return;
		}

		try {
			const filePath = await apis.save({
				filters: [
					{
						name: "Text Files",
						extensions: ["txt", "md"],
					},
				],
			});

			if (filePath) {
				await apis.fs.writeTextFile(filePath, fileContent);
				await apis.notification.send({
					title: "File Saved",
					body: `Saved to: ${filePath}`,
					icon: "success",
				});
			}
		} catch (error) {
			console.error("Error saving file:", error);
		}
	};

	const requestNotificationPermission = async () => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.notification) {
			alert("Notification API not available");
			return;
		}

		try {
			const permission = await apis.notification.requestPermission();
			setNotificationPermission(permission);
		} catch (error) {
			console.error("Error requesting notification permission:", error);
		}
	};

	const sendNotificationByType = async (type: string) => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.notification) {
			alert("Notification API not available");
			return;
		}

		const notifications = {
			info: {
				title: "Information",
				body: "This is an informational notification",
				icon: "info",
			},
			success: {
				title: "Success!",
				body: "Operation completed successfully",
				icon: "success",
			},
			warning: {
				title: "Warning",
				body: "Please check your input",
				icon: "warning",
			},
			error: {
				title: "Error",
				body: "Something went wrong",
				icon: "error",
			},
		};

		try {
			await apis.notification.send(
				notifications[type as keyof typeof notifications]
			);
		} catch (error) {
			console.error("Error sending notification:", error);
		}
	};

	const toggleFullscreen = async () => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.appWindow) {
			alert("Window API not available");
			return;
		}

		try {
			const isFullscreen = await apis.appWindow.isFullscreen();
			if (isFullscreen) {
				await apis.appWindow.setFullscreen(false);
			} else {
				await apis.appWindow.setFullscreen(true);
			}
		} catch (error) {
			console.error("Error toggling fullscreen:", error);
		}
	};

	const copyToClipboard = async () => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.clipboard || !apis?.notification) {
			alert("Clipboard or notification API not available");
			return;
		}

		try {
			await apis.clipboard.writeText("Hello from DeepFlow Click!");
			await apis.notification.send({
				title: "Copied!",
				body: "Text copied to clipboard",
				icon: "success",
			});
		} catch (error) {
			console.error("Error copying to clipboard:", error);
		}
	};

	const readFromClipboard = async () => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.clipboard) {
			alert("Clipboard API not available");
			return;
		}

		try {
			const text = await apis.clipboard.readText();
			setClipboardText(text);
		} catch (error) {
			console.error("Error reading from clipboard:", error);
		}
	};

	const openExternalLink = async () => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.shell) {
			alert("Shell API not available");
			return;
		}

		try {
			await apis.shell.open("https://tauri.app", "https");
		} catch (error) {
			console.error("Error opening external link:", error);
		}
	};

	const getAppDataDir = async () => {
		if (!isTauriEnvironment) {
			alert("Tauri APIs not available in web environment");
			return;
		}

		const apis = getTauriAPIs();
		if (!apis?.path || !apis?.notification) {
			alert("Path or notification API not available");
			return;
		}

		try {
			const appDataDirPath = await apis.path.appDataDir();
			await apis.notification.send({
				title: "App Data Directory",
				body: appDataDirPath,
				icon: "info",
			});
		} catch (error) {
			console.error("Error getting app data directory:", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="card bg-base-100 shadow-xl p-6">
				<div className="card-body">
					<h2 className="card-title text-primary">Tauri Desktop Features</h2>
					<p className="text-sm text-base-content/70 mb-4">
						This component demonstrates native desktop functionality using Tauri
						APIs.
					</p>

					{/* System Information */}
					{systemInfo && (
						<div className="alert alert-info">
							<div>
								<h3 className="font-bold">System Information</h3>
								<p>Platform: {systemInfo.platform}</p>
								<p>Architecture: {systemInfo.arch}</p>
								<p>OS Version: {systemInfo.osVersion}</p>
								<p>Node Version: {systemInfo.nodeVersion}</p>
							</div>
						</div>
					)}

					{/* Rust Integration Example */}
					{greeting && (
						<div className="alert alert-success">
							<span>Rust says: {greeting}</span>
						</div>
					)}

					{/* Debug Section */}
					<div className="flex gap-2 mt-4">
						<button className="btn btn-sm btn-outline" onClick={debugTauriAPIs}>
							Debug Tauri APIs
						</button>
						<div className="badge badge-outline">
							Environment: {isTauriEnvironment ? "Tauri" : "Web"}
						</div>
					</div>
				</div>
			</div>

			{/* Notifications Section */}
			<div className="card bg-base-100 shadow-xl p-6">
				<div className="card-body">
					<h3 className="card-title text-secondary">Notifications</h3>
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<span className="text-sm">Permission Status:</span>
							<div
								className={`badge ${
									notificationPermission === "granted"
										? "badge-success"
										: notificationPermission === "denied"
										? "badge-error"
										: "badge-warning"
								}`}
							>
								{notificationPermission}
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<button
								className="btn btn-sm btn-outline"
								onClick={requestNotificationPermission}
							>
								Request Permission
							</button>
							<button
								className="btn btn-sm btn-info"
								onClick={() => sendNotificationByType("info")}
							>
								Info Notification
							</button>
							<button
								className="btn btn-sm btn-success"
								onClick={() => sendNotificationByType("success")}
							>
								Success Notification
							</button>
							<button
								className="btn btn-sm btn-warning"
								onClick={() => sendNotificationByType("warning")}
							>
								Warning Notification
							</button>
							<button
								className="btn btn-sm btn-error"
								onClick={() => sendNotificationByType("error")}
							>
								Error Notification
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* File Operations Section */}
			<div className="card bg-base-100 shadow-xl p-6">
				<div className="card-body">
					<h3 className="card-title text-accent">File Operations</h3>
					<div className="space-y-4">
						<div className="flex gap-2">
							<button
								className="btn btn-primary btn-sm"
								onClick={handleFileOpen}
							>
								Open File
							</button>
							<button
								className="btn btn-secondary btn-sm"
								onClick={handleFileSave}
							>
								Save File
							</button>
						</div>

						{selectedFile && (
							<div className="alert alert-info">
								<span>Selected: {selectedFile}</span>
							</div>
						)}

						{fileContent && (
							<div className="form-control">
								<label className="label">
									<span className="label-text">File Content</span>
								</label>
								<textarea
									className="textarea textarea-bordered h-32"
									value={fileContent}
									onChange={(e) => setFileContent(e.target.value)}
									placeholder="File content will appear here..."
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Window Controls Section */}
			<div className="card bg-base-100 shadow-xl p-6">
				<div className="card-body">
					<h3 className="card-title text-warning">Window Controls</h3>
					<div className="flex flex-wrap gap-2">
						<button
							className="btn btn-secondary btn-sm"
							onClick={toggleFullscreen}
						>
							Toggle Fullscreen
						</button>
						<button
							className="btn btn-accent btn-sm"
							onClick={() => {
								if (isTauriEnvironment) {
									const apis = getTauriAPIs();
									if (apis?.appWindow) {
										apis.appWindow.minimize();
									} else {
										alert("Window API not available");
									}
								} else {
									alert("Tauri APIs not available in web environment");
								}
							}}
						>
							Minimize
						</button>
						<button
							className="btn btn-info btn-sm"
							onClick={() => {
								if (isTauriEnvironment) {
									const apis = getTauriAPIs();
									if (apis?.appWindow) {
										apis.appWindow.maximize();
									} else {
										alert("Window API not available");
									}
								} else {
									alert("Tauri APIs not available in web environment");
								}
							}}
						>
							Maximize
						</button>
						<button
							className="btn btn-error btn-sm"
							onClick={() => {
								if (isTauriEnvironment) {
									const apis = getTauriAPIs();
									if (apis?.appWindow) {
										apis.appWindow.close();
									} else {
										alert("Window API not available");
									}
								} else {
									alert("Tauri APIs not available in web environment");
								}
							}}
						>
							Close Window
						</button>
					</div>
				</div>
			</div>

			{/* Clipboard Operations Section */}
			<div className="card bg-base-100 shadow-xl p-6">
				<div className="card-body">
					<h3 className="card-title text-success">Clipboard Operations</h3>
					<div className="space-y-4">
						<div className="flex gap-2">
							<button
								className="btn btn-primary btn-sm"
								onClick={copyToClipboard}
							>
								Copy to Clipboard
							</button>
							<button
								className="btn btn-secondary btn-sm"
								onClick={readFromClipboard}
							>
								Read from Clipboard
							</button>
						</div>

						{clipboardText && (
							<div className="alert alert-info">
								<span>Clipboard content: {clipboardText}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* System Integration Section */}
			<div className="card bg-base-100 shadow-xl p-6">
				<div className="card-body">
					<h3 className="card-title text-info">System Integration</h3>
					<div className="flex flex-wrap gap-2">
						<button
							className="btn btn-outline btn-sm"
							onClick={openExternalLink}
						>
							Open Tauri Website
						</button>
						<button className="btn btn-outline btn-sm" onClick={getAppDataDir}>
							Get App Data Directory
						</button>
					</div>
				</div>
			</div>

			<div className="card-actions justify-end">
				<div className="badge badge-outline">Desktop Only</div>
			</div>
		</div>
	);
}
