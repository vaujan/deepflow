"use client";

import React from "react";
import { DataTable } from "./data-table";
import { transformSessionsToDataItems } from "../../utils/sessionDataTransformer";
import { useStatsSessions } from "@/src/hooks/useStatsSessions";

export default function SessionHistory() {
	const { data: sessions = [] } = useStatsSessions();
	const dataItems = transformSessionsToDataItems(sessions as any);

	return <DataTable data={dataItems} />;
}
