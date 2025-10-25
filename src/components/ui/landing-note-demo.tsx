"use client";

import React from "react";
import { Plus, Trash2, Notebook, FileText } from "lucide-react";

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

				{/* Note card (read-only preview) */}
				<div className="card bg-base-200 shadow-sm relative group">
					<div className="card-body p-3 pb-2">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2 min-w-0">
								<h3
									className="text-sm font-medium text-base-content/90 truncate max-w-[200px]"
									title="ultra important stuff for the week"
								>
									ultra important stuff for the week
								</h3>
								<span className="text-xs text-base-content/50 flex-shrink-0 flex items-center gap-1">
									Oct 20
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
							<h2>ultra important stuff for the week:</h2>
							<ol>
								<li>basic landing page</li>
								<li>
									guest mode, so they can try directly use app without having to
									sign in first
								</li>
								<li>polished onboarding setup</li>
							</ol>
						</div>
					</div>
				</div>

				{/* Second note preview */}
				<div className="card bg-base-200 shadow-sm relative group">
					<div className="card-body p-3 pb-2">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2 min-w-0">
								<h3
									className="text-sm font-medium text-base-content/90 truncate max-w-[200px]"
									title="things to learn that can help VX (vibe code experience)"
								>
									things to learn that can help VX (vibe code experience)
								</h3>
								<span className="text-xs text-base-content/50 flex-shrink-0 flex items-center gap-1">
									Oct 16
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
							<h2>things to learn that can help VX (vibe code experience)</h2>
							<ul>
								<li>
									learn database interaction, getting, posting, putting data
								</li>
								<li>learn from performance perspective and ux</li>
								<li>
									learn backend for better understanding of the database
									interaction
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
