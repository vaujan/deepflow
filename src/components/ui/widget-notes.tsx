import { Plus } from "lucide-react";
import React from "react";

export default function WidgetNotes() {
	return (
		<div className="w-full max-w-xl flex flex-col gap-2 min-w-[550px]">
			<div className="flex justify-end text-base-content/80">
				<button className="btn btn-ghost btn-circle btn-sm">
					<Plus className="size-4" />
				</button>
			</div>

			{/* Note list goes here */}

			<div className="flex flex-col gap-4 rounded-box max-h-[900px] overflow-y-auto">
				{/* This is the second note */}
				<div className="w-full card text-base-content/90 bg-base-100 p-4 shadow-xl transition-all ease-out">
					{/* This is the data about the note title and time created */}

					<div className="flex justify-between text-base-content/50 mb-3">
						<span className="badge badge-sm badge-ghost ">Untitled</span>
						<p className="text-xs">Created at 10.02</p>
					</div>

					<p className="mb-2">
						|
						<span className="text-base-content/20 ml-2">
							User is writing mode here
						</span>
					</p>
				</div>

				{/* This is the second note */}
				<div className="w-full card text-base-content/90 bg-base-100 p-4">
					{/* This is the data about the note title and time created */}

					<div className="flex justify-between text-base-content/50 mb-3">
						<span className="badge badge-sm badge-ghost ">The newer note</span>
						<p className="text-xs">Created at 10.01</p>
					</div>

					<p className="mb-2">
						When we click add note, it will directly add a new note like this
						one and we put the user straight into writing. <br />
						The writing should accept markdown format and doing live preview
					</p>
				</div>

				<div className="w-full card text-base-content/90 bg-base-100 p-4">
					{/* This is the data about the note title and time created */}
					<div className="flex justify-between text-base-content/50 mb-3">
						<span className="badge badge-sm badge-ghost ">The older note</span>
						<p className="text-xs">Created at 10.00</p>
					</div>

					{/* The content below should be written with markdown */}
					<h3 className="text-xl font-medium border-b border-base-content/50 mb-4">
						Hello world, this is should be a heading written in markdown
						convetion (using "#")
					</h3>
					<p className="mb-2">
						<span className="font-semibold">Better Call Saul</span> is an
						American neo-noir legal crime drama television series created by
						Vince Gilligan and Peter Gould for AMC. Part of the Breaking Bad
						franchise, it is a spin-off of Gilligan's previous series, Breaking
						Bad (2008–2013), to which it serves primarily as a prequel, with
						some scenes taking place during and after the events of Breaking
						Bad. Better Call Saul premiered on AMC on February 8, 2015, and
						ended on August 15, 2022, after six seasons, totalling 63 episodes.
					</p>
					<p>
						Set primarily in the early to mid-2000s in Albuquerque, New Mexico,
						several years before the events of Breaking Bad, Better Call Saul
						examines the ethical decline of Jimmy McGill (Bob Odenkirk), an
						aspiring lawyer and former con artist who becomes the egocentric
						criminal-defense attorney Saul Goodman alongside his romantic
						interest and colleague Kim Wexler (Rhea Seehorn), while dealing with
						conflicts with his brother Chuck McGill (Michael McKean) and his law
						partner Howard Hamlin (Patrick Fabian). The show also follows Mike
						Ehrmantraut (Jonathan Banks), a former corrupt police officer who
						becomes a fixer and enforcer for drug traffickers, such as drug
						dealer Nacho Varga (Michael Mando).
					</p>
				</div>
			</div>
		</div>
	);
}
