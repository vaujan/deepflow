import { LogOut, Settings, User, Mail, Calendar, Shield } from "lucide-react";
import React, { useState } from "react";

export default function Profile() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<>
			{/* Profile Button - Clickable to open modal */}
			<button
				onClick={openModal}
				className="transition-all group hover:bg-base-100 rounded-box w-full items-center px-4 py-4 border-1 border-base-200 flex gap-3 relative cursor-pointer"
			>
				<div className="avatar avatar-online">
					<div className="w-10 rounded-full">
						<img
							src="https://img.daisyui.com/images/profile/demo/gordon@192.webp"
							alt="Profile"
						/>
					</div>
				</div>
				<div className="flex flex-col text-sm">
					<span className="font-medium text-base-content">Ahmad Fauzan</span>
					<p className="text-base-content/50">buildfrombed@gmail.com</p>
				</div>
				<div className="ml-auto">
					<User className="w-4 h-4 text-base-content/50" />
				</div>
			</button>

			{/* Profile Modal */}
			<dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
				<div className="modal-box max-w-md">
					{/* Modal Header */}
					<div className="flex items-center justify-between mb-6">
						<h3 className="font-bold text-lg">Profile</h3>
						<button
							onClick={closeModal}
							className="btn btn-sm btn-circle btn-ghost"
						>
							✕
						</button>
					</div>

					{/* Profile Information */}
					<div className="space-y-6">
						{/* Avatar and Name */}
						<div className="flex flex-col items-center text-center">
							<div className="avatar avatar-online mb-4">
								<div className="w-24 rounded-full">
									<img
										src="https://img.daisyui.com/images/profile/demo/gordon@192.webp"
										alt="Profile"
									/>
								</div>
							</div>
							<h2 className="text-xl font-bold text-base-content">
								Ahmad Fauzan
							</h2>
							<p className="text-base-content/70">Focus Enthusiast</p>
						</div>

						{/* User Details */}
						<div className="space-y-4">
							<div className="flex items-center gap-3 p-3 bg-base-200 rounded-box">
								<Mail className="w-5 h-5 text-primary" />
								<div className="flex-1">
									<p className="text-sm text-base-content/60">Email</p>
									<p className="font-medium">buildfrombed@gmail.com</p>
								</div>
							</div>

							<div className="flex items-center gap-3 p-3 bg-base-200 rounded-box">
								<Calendar className="w-5 h-5 text-secondary" />
								<div className="flex-1">
									<p className="text-sm text-base-content/60">Member Since</p>
									<p className="font-medium">January 2024</p>
								</div>
							</div>

							<div className="flex items-center gap-3 p-3 bg-base-200 rounded-box">
								<Shield className="w-5 h-5 text-accent" />
								<div className="flex-1">
									<p className="text-sm text-base-content/60">Account Type</p>
									<p className="font-medium">Premium</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col gap-3 pt-4">
							<button className="btn btn-outline btn-primary w-full">
								<Settings className="w-4 h-4 mr-2" />
								Edit Profile
							</button>
							<button className="btn btn-outline btn-secondary w-full">
								<User className="w-4 h-4 mr-2" />
								Account Settings
							</button>
							<button className="btn btn-outline btn-error w-full">
								<LogOut className="w-4 h-4 mr-2" />
								Sign Out
							</button>
						</div>
					</div>
				</div>

				{/* Modal Backdrop */}
				<form method="dialog" className="modal-backdrop" onClick={closeModal}>
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
