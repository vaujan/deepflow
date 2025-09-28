const { contextBridge, ipcRenderer } = require("electron");

const api = {
	openExternal: (url) => ipcRenderer.invoke("open-external", url),
	window: {
		minimize: () => ipcRenderer.invoke("window:minimize"),
		toggleMaximize: () => ipcRenderer.invoke("window:toggleMaximize"),
		isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
		close: () => ipcRenderer.invoke("window:close"),
		onMaximizeChanged: (handler) => {
			const listener = (_event, isMax) => handler?.(isMax);
			ipcRenderer.on("window:maximize-changed", listener);
			return () =>
				ipcRenderer.removeListener("window:maximize-changed", listener);
		},
	},
};

contextBridge.exposeInMainWorld("electron", api);
