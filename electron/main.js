const { app, BrowserWindow, ipcMain, shell, protocol } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow = null;
let nextServerProcess = null;

const isDev =
	process.env.NODE_ENV === "development" || process.env.ELECTRON_DEV === "true";
const NEXT_DEV_URL = process.env.NEXT_DEV_URL || "http://localhost:3000";
const NEXT_PROD_PORT = process.env.NEXT_PROD_PORT || "3000";

function createMainWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
		show: false,
	});

	win.on("ready-to-show", () => win.show());
	win.on("closed", () => {
		mainWindow = null;
	});

	return win;
}

async function loadURLIntoWindow(window) {
	if (isDev) {
		await window.loadURL(NEXT_DEV_URL);
		window.webContents.openDevTools({ mode: "detach" });
	} else {
		// Your Next config is set to output: 'export', so we can load local files
		const indexPath = path.join(__dirname, "..", "out", "index.html");
		await window.loadFile(indexPath);

		// Fix for client-side navigation assets when loading file://
		window.webContents.session.protocol.registerFileProtocol(
			"app",
			(request, callback) => {
				const url = request.url.replace("app://", "");
				const filePath = path.normalize(path.join(__dirname, "..", "out", url));
				callback({ path: filePath });
			}
		);
	}
}

function startNextInProduction() {
	return new Promise((resolve, reject) => {
		const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
		nextServerProcess = spawn(command, ["start", "--", "-p", NEXT_PROD_PORT], {
			cwd: path.join(__dirname, ".."),
			env: { ...process.env, NODE_ENV: "production" },
			stdio: "inherit",
		});

		let resolved = false;
		const onReady = () => {
			if (!resolved) {
				resolved = true;
				resolve();
			}
		};
		setTimeout(onReady, 2000);

		nextServerProcess.on("error", (err) => reject(err));
		nextServerProcess.on("exit", (code) => {
			if (!resolved) reject(new Error(`next start exited with code ${code}`));
		});
	});
}

function stopNextServer() {
	if (nextServerProcess && !nextServerProcess.killed) {
		try {
			nextServerProcess.kill();
		} catch (_) {}
	}
}

function setupAppEvents() {
	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
	});
	app.on("activate", () => {
		if (mainWindow === null) {
			mainWindow = createMainWindow();
			loadURLIntoWindow(mainWindow).catch(console.error);
		}
	});
}

function setupIpc() {
	ipcMain.handle("open-external", async (_event, url) => {
		await shell.openExternal(url);
		return true;
	});
}

async function bootstrap() {
	setupIpc();
	setupAppEvents();

	if (!isDev) {
		// If you decide to serve SSR instead of static files, uncomment below
		// await startNextInProduction();
	}

	mainWindow = createMainWindow();
	await loadURLIntoWindow(mainWindow);
}

app
	.whenReady()
	.then(bootstrap)
	.catch((err) => {
		console.error(err);
		app.exit(1);
	});

app.on("before-quit", () => {
	stopNextServer();
});
