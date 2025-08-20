import React from "react";

export default function Stats() {
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
		<div className="overflow-x-auto h-full w-full">
			<div className="flex overflow-y-auto h-full border border-base-100 rounded-box overflow-hidden">
				<table className="table table-pin-rows table-pin-cols table-md overflow-y-auto">
					{/* head */}
					<thead>
						<tr className="text-sm">
							<th className="w-0 p-0 bg-base-300/50 hover:bg-base-300"></th>
							<th className="bg-base-300/50 hover:bg-base-300">Artist</th>
							<th className="bg-base-300/50 hover:bg-base-300">Song</th>
						</tr>
					</thead>
					<tbody>
						{/* row 1 */}
						{songs.map((song, index) => (
							<tr key={song.id}>
								<th className="border-r border-base-100 text-base-content/50 font-medium items-center justify-center flex">
									{index + 1}
								</th>
								<td className="font-medium">{song.artist}</td>
								<td>{song.title}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
