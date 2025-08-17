"use client";
import { Plus } from "lucide-react";
import React from "react";

export default function Page() {
	const [count, setCount] = React.useState(0);

	const songs = [
		{ id: 1, title: "Bohemian Rhapsody", artist: "Queen" },
		{ id: 2, title: "Imagine", artist: "John Lennon" },
		{ id: 3, title: "Billie Jean", artist: "Michael Jackson" },
		{ id: 4, title: "Hey Jude", artist: "The Beatles" },
		{ id: 5, title: "Smells Like Teen Spirit", artist: "Nirvana" },
	];

	return (
		<div className="min-h-screen flex flex-col items-center">
			<main className="max-w-6xl flex flex-1 items-center">
				<div className="card p-6 gap-3 bg-base-200">
					<h1 className="text-xl font-semibold">Counter {count}</h1>
					<p className="text-sm text-base-content/50">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit.
						Voluptatibus tempore deserunt laboriosam sunt cum eos itaque natus!
						Et error nostrum sint explicabo asperiores, in voluptas sit dolores
						quisquam harum impedit.
					</p>
					<ul className="list bg-base-100 rounded-box">
						<li className="list-row">
							<div className="badge badge-neutral badge-sm">list of songs</div>
						</li>
						{songs.map((song) => (
							<li className="list-row flex items-center">
								{song.title}
								<p className="text-xs text-base-content/50">{song.artist}</p>
							</li>
						))}
					</ul>
					<div className="overflow-x-auto">
						<div className="flex border-1 rounded-lg overflow-hidden border-base-300">
							<table className="table table-zebra table-sm">
								{/* head */}
								<thead>
									<tr className="text-xs">
										<th className="bg-base-300/50 hover:bg-base-300"></th>
										<th className="bg-base-300/50 hover:bg-base-300">Artist</th>
										<th className="bg-base-300/50 hover:bg-base-300">Song</th>
									</tr>
								</thead>
								<tbody>
									{/* row 1 */}
									{songs.map((song, index) => (
										<tr>
											<th className="border-r border-base-100 text-base-content/50 font-medium items-center justify-center flex">
												{index}
											</th>
											<td>{song.artist}</td>
											<td>{song.title}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="card-actions mt-4  items-center">
						<button
							onClick={() => setCount(count + 1)}
							className="btn btn-primary btn-sm"
						>
							Hello world
						</button>
						<button className="btn btn-ghost btn-sm">cancel</button>
					</div>
				</div>
			</main>
		</div>
	);
}
