/*
 Minimal guest storage using localStorage. We keep schema versioning and
 namespaced keys to avoid collisions. IndexedDB/localForage can be swapped in
 later without changing consumers.
*/

export interface GuestMeta {
	createdAt: string;
	schemaVersion: number;
	migratedAt?: string | null;
}

export interface GuestNote {
	id: number;
	title: string;
	content: string;
	timestamp: string;
	_clientId?: string;
}

export interface GuestTask {
	id: number;
	title: string;
	description?: string;
	completed: boolean;
	dueDate?: string;
	project?: string;
}

const NAMESPACE = "deepflow_guest_v1";

const KEYS = {
	notes: `${NAMESPACE}:notes`,
	tasks: `${NAMESPACE}:tasks`,
	meta: `${NAMESPACE}:meta`,
} as const;

function safeGet<T>(key: string): T | null {
	try {
		const raw =
			typeof window !== "undefined" ? localStorage.getItem(key) : null;
		if (!raw) return null;
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

function safeSet<T>(key: string, value: T): void {
	try {
		if (typeof window === "undefined") return;
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}

export const guestStorage = {
	getMeta(): GuestMeta | null {
		return safeGet<GuestMeta>(KEYS.meta);
	},
	setMeta(meta: GuestMeta): void {
		safeSet(KEYS.meta, meta);
	},
	getNotes(): GuestNote[] {
		return safeGet<GuestNote[]>(KEYS.notes) ?? [];
	},
	setNotes(notes: GuestNote[]): void {
		safeSet(KEYS.notes, notes);
	},
	getTasks(): GuestTask[] {
		return safeGet<GuestTask[]>(KEYS.tasks) ?? [];
	},
	setTasks(tasks: GuestTask[]): void {
		safeSet(KEYS.tasks, tasks);
	},
	clear(): void {
		try {
			if (typeof window === "undefined") return;
			localStorage.removeItem(KEYS.notes);
			localStorage.removeItem(KEYS.tasks);
			localStorage.removeItem(KEYS.meta);
		} catch {}
	},
};

export function initializeGuestStorageIfNeeded(
	seedNotes: GuestNote[],
	seedTasks: GuestTask[]
): void {
	const meta = guestStorage.getMeta();
	if (meta) return; // already initialized

	const nowIso = new Date().toISOString();
	guestStorage.setMeta({
		createdAt: nowIso,
		schemaVersion: 1,
		migratedAt: null,
	});
	guestStorage.setNotes(seedNotes);
	guestStorage.setTasks(seedTasks);
}
