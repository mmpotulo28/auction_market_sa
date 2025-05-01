"use client";
import React from "react";
import styles from "./lockup.module.css";
import { iLockUpProps, iTheme } from "@/lib/types";

const LockUp: React.FC<iLockUpProps> = ({
	id,
	overline,
	title = "LockUp Title",
	subtitle,
	variant = "primary",
	size = "md",
	theme = iTheme.Dark,
	centered = false,
	bold = false,
}) => {
	const truncate = (text?: string) => {
		if (!text) return "";
		return text.length > 256 ? `${text.substring(0, 253)}...` : text;
	};

	const classNames = [
		styles.lockup,
		styles[variant],
		styles[size],
		styles[theme],
		centered ? styles.centered : "",
		bold ? styles.bold : "",
	].join(" ");

	return (
		<div id={id} className={classNames}>
			{overline && <span>{truncate(overline)}</span>}
			<h1>{truncate(title)}</h1>
			{subtitle && <p>{truncate(subtitle)}</p>}
		</div>
	);
};

export default LockUp;
