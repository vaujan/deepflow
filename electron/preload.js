const { contextBridge, ipcRenderer } = require("electron");

const api = {
	openExternal: (url) => ipcRenderer.invoke("open-external", url),
};

contextBridge.exposeInMainWorld("electron", api);
