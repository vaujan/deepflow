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
		{ id: 6, title: "Hotel California", artist: "Eagles" },
		{ id: 7, title: "Stairway to Heaven", artist: "Led Zeppelin" },
		{ id: 8, title: "Like a Rolling Stone", artist: "Bob Dylan" },
		{ id: 9, title: "What's Going On", artist: "Marvin Gaye" },
		{ id: 10, title: "Sweet Child o' Mine", artist: "Guns N' Roses" },
	];

	return (
		<div className="card gap-3 w-full">
			<h1 className="card-title font-semibold">Counter {count}</h1>
			<p className="text-sm text-base-content/50">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
				tempore deserunt laboriosam sunt cum eos itaque natus! Et error nostrum
				sint explicabo asperiores, in voluptas sit dolores quisquam harum
				impedit.
			</p>
			<div className="flex flex-col lg:flex-row w-full gap-3">
				<ul className="list bg-base-200 rounded-box w-full">
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
				<div className="overflow-x-auto w-full">
					<div className="flex overflow-y-auto max-h-[350px] rounded-box overflow-hidden">
						<table className="table table-zebra table-pin-rows table-pin-cols table-md overflow-y-auto">
							{/* head */}
							<thead>
								<tr className="text-sm">
									<th className="w-0 bg-base-300/50 hover:bg-base-300"></th>
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
										<td className="font-medium">{song.artist}</td>
										<td>{song.title}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
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
