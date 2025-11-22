import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function LandingFooter() {
	return (
		<footer className="w-full bg-base-200/50 border-t border-base-content/10 pt-16 pb-8 px-12">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
				<div className="col-span-1 md:col-span-1">
					<div className="font-mono text-xl font-bold mb-4">deepflow</div>
					<p className="text-base-content/70 mb-6">
						Master your focus. <br />
						Achieve your flow.
					</p>
					<div className="flex gap-4">
						<a
							href="#"
							className="text-base-content/50 hover:text-primary transition-colors"
						>
							<Twitter className="size-5" />
						</a>
						<a
							href="#"
							className="text-base-content/50 hover:text-primary transition-colors"
						>
							<Github className="size-5" />
						</a>
						<a
							href="#"
							className="text-base-content/50 hover:text-primary transition-colors"
						>
							<Linkedin className="size-5" />
						</a>
					</div>
				</div>

				<div>
					<h4 className="font-bold mb-6">Product</h4>
					<ul className="space-y-4 text-base-content/70">
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Features
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Pricing
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Download
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Changelog
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="font-bold mb-6">Company</h4>
					<ul className="space-y-4 text-base-content/70">
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								About
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Blog
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Careers
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Contact
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="font-bold mb-6">Legal</h4>
					<ul className="space-y-4 text-base-content/70">
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Privacy
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Terms
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Security
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="max-w-7xl mx-auto pt-8 border-t border-base-content/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-base-content/50">
				<p>© {new Date().getFullYear()} Deepflow. All rights reserved.</p>
				<p>Designed for deep work.</p>
			</div>
		</footer>
	);
}
