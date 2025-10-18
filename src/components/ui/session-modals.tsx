"use client";

import React from "react";
import { useSession } from "../../hooks/useSession";
import EarlyStopConfirmationModal from "./early-stop-confirmation-modal";
import CompleteSessionFormModal from "./complete-session-form-modal";

export default function SessionModals() {
	const {
		showEarlyStopModal,
		showCompleteFormModal,
		currentSession,
		elapsedTime,
		handleEarlyStopProceed,
		handleEarlyStopCancel,
		handleCompleteFormClose,
	} = useSession();

	return (
		<>
			<EarlyStopConfirmationModal
				isOpen={showEarlyStopModal}
				onClose={handleEarlyStopCancel}
				elapsedSeconds={elapsedTime}
				onProceedToComplete={handleEarlyStopProceed}
			/>
			{currentSession && (
				<CompleteSessionFormModal
					isOpen={showCompleteFormModal}
					onClose={handleCompleteFormClose}
					session={currentSession}
					elapsedSeconds={elapsedTime}
				/>
			)}
		</>
	);
}
