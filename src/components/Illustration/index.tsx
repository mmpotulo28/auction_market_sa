import React from "react";

export type IllustrationType = "success" | "error" | "loading";

const Illustration: React.FC<{ type: IllustrationType; className?: string }> = ({
	type,
	className,
}) => {
	if (type === "success") {
		return (
			<svg
				width="120"
				height="120"
				viewBox="0 0 120 120"
				className={"mb-6" + (className ? " " + className : "")}>
				<circle cx="60" cy="60" r="56" fill="#e0ffe6" stroke="#22c55e" strokeWidth="4" />
				<polyline
					points="40,65 55,80 80,45"
					fill="none"
					stroke="#22c55e"
					strokeWidth="6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}
	if (type === "loading") {
		return (
			<svg
				width="60"
				height="60"
				viewBox="0 0 60 60"
				className={"mb-6 animate-spin" + (className ? " " + className : "")}>
				<circle
					cx="30"
					cy="30"
					r="26"
					stroke="#6366f1"
					strokeWidth="6"
					fill="none"
					strokeDasharray="40 60"
				/>
			</svg>
		);
	}
	// error
	return (
		<svg
			width="120"
			height="120"
			viewBox="0 0 120 120"
			className={"mb-6" + (className ? " " + className : "")}>
			<circle cx="60" cy="60" r="56" fill="#ffeaea" stroke="#ef4444" strokeWidth="4" />
			<line
				x1="45"
				y1="45"
				x2="75"
				y2="75"
				stroke="#ef4444"
				strokeWidth="6"
				strokeLinecap="round"
			/>
			<line
				x1="75"
				y1="45"
				x2="45"
				y2="75"
				stroke="#ef4444"
				strokeWidth="6"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default Illustration;
