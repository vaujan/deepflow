"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LandingNoteDemo() {
	return (
		<div className="card">
			<div className="card-body gap-3">
				{/* Header */}
				<div className="flex items-center justify-between">
					<span className="text-lg font-medium text-base-content/80">
						Notes
					</span>
					<button className="btn btn-circle btn-sm btn-ghost" disabled>
						<Plus className="size-4" />
					</button>
				</div>

				{/* Note card (read-only markdown preview) */}
				<NoteCard
					title="CS Weekly Plan — Algorithms & DS"
					date="Oct 20"
					markdown={demoMarkdownOne}
					tags={["Algorithms", "DSA", "LeetCode"]}
				/>

				{/* Second note preview */}
				<NoteCard
					title="Systems Cheat Sheet — OS / DB / Networks"
					date="Oct 16"
					markdown={demoMarkdownTwo}
					tags={["Operating Systems", "DBMS", "Networks"]}
				/>
			</div>
		</div>
	);
}

function NoteCard({
	title,
	date,
	markdown,
	tags,
}: {
	title: string;
	date: string;
	markdown: string;
	tags?: string[];
}) {
	return (
		<div className="card bg-base-200 shadow-sm relative group">
			<div className="card-body p-3 pb-2">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 min-w-0">
						<h3
							className="text-sm font-medium text-base-content/90 truncate max-w-[220px]"
							title={title}
						>
							{title}
						</h3>
						{tags && tags.length > 0 && (
							<div className="hidden sm:flex gap-1 flex-wrap">
								{tags.map((t) => (
									<span key={t} className="badge badge-ghost badge-sm">
										{t}
									</span>
								))}
							</div>
						)}
						<span className="text-xs text-base-content/50 flex-shrink-0 flex items-center gap-1">
							{date}
							<div className="size-1.5 rounded-full bg-base-content/60" />
						</span>
					</div>
					<button
						className="btn btn-xs btn-ghost btn-square opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
						disabled
					>
						<Trash2 className="size-3 text-error" />
					</button>
				</div>
			</div>
			<div className="px-3 pb-3">
				<div className="prose prose-sm max-w-none">
					<Markdown content={markdown} />
				</div>
			</div>
		</div>
	);
}

function Markdown({ content }: { content: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				code({ inline, className, children, ...props }) {
					const isInline = inline || !/language-/.test(className || "");
					if (isInline) {
						return (
							<code className="px-1.5 py-0.5 rounded bg-base-300/70 text-base-content/90" {...props}>
								{children}
							</code>
						);
					}
					return (
						<pre className="bg-base-300/60 rounded-box p-3 overflow-x-auto">
							<code className="text-sm leading-6" {...props}>{children}</code>
						</pre>
					);
				},
			}}
		>
			{content}
		</ReactMarkdown>
	);
}

const demoMarkdownOne = `# Algorithms & Data Structures — Weekly Plan

- [x] Arrays & Hashing review
- [x] Two Pointers (3 problems)
- [ ] Graphs: BFS/DFS (5 problems)
- [ ] Dynamic Programming: knapsack variants

> Tip: practice until time/space complexity analysis becomes automatic.

## BFS Template (TypeScript)

\`\`\`ts
function bfs(start: number, adj: number[][]) {
  const queue: number[] = [start]
  const visited = new Set<number>([start])
  while (queue.length) {
    const node = queue.shift()!
    for (const nei of adj[node] ?? []) {
      if (!visited.has(nei)) {
        visited.add(nei)
        queue.push(nei)
      }
    }
  }
  return visited
}
\`\`\`

### Big-O cheatsheet

| Algorithm | Best | Average | Worst |
|----------|:----:|:------:|:-----:|
| MergeSort | n log n | n log n | n log n |
| QuickSort | n log n | n log n | n^2 |
| Binary Search | 1 | log n | log n |

---

Next focus: **topological sort**, **Dijkstra**, and sliding window patterns.
`;

const demoMarkdownTwo = `## Systems Cheat Sheet

### OS
- Process vs Thread; Context switching
- Scheduling: RR, SJF, Priority
- Synchronization: mutex, semaphore, deadlock conditions

### DBMS
- ACID, Normal forms (1NF, 2NF, 3NF)
- Indexes (B+Trees), transactions, isolation levels

### Networking
- OSI vs TCP/IP, 3-way handshake, TLS basics

### Dijkstra (pseudocode)
\`\`\`
dist[src] = 0
pq = min-heap of (dist, node)
while pq not empty:
  d, u = pq.pop()
  if d != dist[u]: continue
  for (v, w) in edges[u]:
    if dist[u] + w < dist[v]:
      dist[v] = dist[u] + w
      pq.push(dist[v], v)
\`\`\`

> Remember: choose the right data structure first, then code.
`;
