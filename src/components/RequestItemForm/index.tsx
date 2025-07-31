"use client";
import React from "react";

import { useRequestItemForm } from "@/hooks/useRequestItemForm";
import styles from "./request-item-form.module.css";
import { FormStep1, FormStep2 } from "./steps";

export const RequestItemForm: React.FC = () => {
	const { step } = useRequestItemForm();

	return (
		<div className={`${styles.card} ${step === 2 ? styles.slideIn : ""}`}>
			{step == 1 ? <FormStep1 /> : <FormStep2 />}
		</div>
	);
};
