import { Plus } from "lucide-react";
import React from "react";

export default function WidgetNotes() {
	return (
		<div className="w-full max-w-xl flex flex-col gap-2 min-w-[550px]">
			<div className="flex justify-between text-base-content/80">
				<h3 className="card-title">Notes</h3>
				<button className="btn btn-ghost btn-circle btn-sm">
					<Plus className="size-4" />
				</button>
			</div>

			{/* Note list goes here */}
			<div className="w-full card text-base-content/90 bg-base-100 p-4">
				<div className="flex justify-between text-base-content/50 mb-3">
					<span className="badge badge-sm badge-ghost ">Hello world</span>
					<p className="text-xs">Created at 10.00</p>
				</div>
				<h3 className="text-xl font-medium border-b border-base-content/50 mb-4">
					Hello world
				</h3>
				<p className="mb-2">
					<span className="font-semibold">Better Call Saul</span> is an American
					neo-noir legal crime drama television series created by Vince Gilligan
					and Peter Gould for AMC. Part of the Breaking Bad franchise, it is a
					spin-off of Gilligan's previous series, Breaking Bad (2008–2013), to
					which it serves primarily as a prequel, with some scenes taking place
					during and after the events of Breaking Bad. Better Call Saul
					premiered on AMC on February 8, 2015, and ended on August 15, 2022,
					after six seasons, totalling 63 episodes.
				</p>
				<p>
					Set primarily in the early to mid-2000s in Albuquerque, New Mexico,
					several years before the events of Breaking Bad, Better Call Saul
					examines the ethical decline of Jimmy McGill (Bob Odenkirk), an
					aspiring lawyer and former con artist who becomes the egocentric
					criminal-defense attorney Saul Goodman alongside his romantic interest
					and colleague Kim Wexler (Rhea Seehorn), while dealing with conflicts
					with his brother Chuck McGill (Michael McKean) and his law partner
					Howard Hamlin (Patrick Fabian). The show also follows Mike Ehrmantraut
					(Jonathan Banks), a former corrupt police officer who becomes a fixer
					and enforcer for drug traffickers, such as drug dealer Nacho Varga
					(Michael Mando).
				</p>
			</div>

			{/* This is the second note */}
			<div className="w-full card text-base-content/90 bg-base-100 p-4">
				<h3 className="text-xl font-medium border-b border-base-content/50 mb-4">
					Hey ho!
				</h3>
				<p className="mb-2">Hello david di sini!</p>
			</div>
		</div>
	);
}
