"use client";

import React from "react";
import { DataTable } from "./data-table";
import { transformSessionsToDataItems } from "../../utils/sessionDataTransformer";
import { useSessionsQuery } from "@/src/hooks/useSessionsQuery";

export default function SessionHistory() {
	const { data: sessions = [] } = useSessionsQuery();
	const dataItems = transformSessionsToDataItems(sessions as any);

	return <DataTable data={dataItems} />;
}
