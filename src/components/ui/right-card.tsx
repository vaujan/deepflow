"use client";

import React from "react";

export default function RightCard() {
	const [count, setCount] = React.useState(0);

	const songs = [
		{ id: 1, title: "Bohemian Rhapsody", artist: "Queen" },
		{ id: 2, title: "Imagine", artist: "John Lennon" },
		{ id: 3, title: "Billie Jean", artist: "Michael Jackson" },
		{ id: 4, title: "Hey Jude", artist: "The Beatles" },
		{ id: 5, title: "Smells Like Teen Spirit", artist: "Nirvana" },
	];

	return (
		<div className="card gap-3 w-full">
			<h1 className="text-xl font-semibold">Counter {count}</h1>
			<p className="text-sm text-base-content/50">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
				tempore deserunt laboriosam sunt cum eos itaque natus! Et error nostrum
				sint explicabo asperiores, in voluptas sit dolores quisquam harum
				impedit.
			</p>
			<ul className="list bg-base-200 rounded-box">
				<li className="list-row">
					<div className="badge badge-neutral badge-sm">list of songs</div>
				</li>
				{songs.map((song) => (
					<li className="list-row flex items-center">
						{song.title}
						<p className="text-sm text-base-content/50">{song.artist}</p>
					</li>
				))}
			</ul>
			<div className="overflow-x-auto">
				<div className="flex border-1 rounded-lg overflow-hidden border-base-200">
					<table className="table table-zebra table-md">
						{/* head */}
						<thead>
							<tr className="text-sm">
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
				<button onClick={() => setCount(count + 1)} className="btn btn-primary">
					Hello world
				</button>
				<button onClick={() => setCount(0)} className="btn btn-ghost">
					Cancel
				</button>
			</div>
		</div>
	);
}
