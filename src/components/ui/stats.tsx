import React from "react";

export default function Stats() {
	return (
		<div className="stats w-fit bg-base-100 border-base-300 border">
			<div className="stat">
				<div className="stat-title">Account balance</div>
				<div className="stat-value">$89,400</div>
				<div className="stat-actions">
					<button className="btn btn-xs btn-success">add more</button>
				</div>
			</div>

			<div className="stat">
				<div className="stat-title">Current balance</div>
				<div className="stat-value">$89,400</div>
				<div className="stat-actions">
					<button className="btn btn-xs">Withdrawal</button>
					<button className="btn btn-xs">Deposit</button>
				</div>
			</div>
		</div>
	);
}
