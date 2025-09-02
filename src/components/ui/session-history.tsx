"use client";

import React from "react";
import { DataTable } from "./data-table";
import { mockSessions } from "../../data/mockSessions";
import { transformSessionsToDataItems } from "../../utils/sessionDataTransformer";

export default function SessionHistory() {
	// Transform session data to the format expected by the data table
	const dataItems = transformSessionsToDataItems(mockSessions);

	return (
		<div className="space-y-4">
			<DataTable data={dataItems} />
		</div>
	);
}
