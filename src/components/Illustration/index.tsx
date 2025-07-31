import React from "react";

export type IllustrationType =
	| "auction"
	| "why"
	| "mission"
	| "team"
	| "security"
	| "join"
	| "success"
	| "error"
	| "loading";

export const Illustrations: Record<IllustrationType, React.ReactNode> = {
	auction: (
		<svg width="180" height="120" viewBox="0 0 180 120" fill="none">
			<rect x="10" y="70" width="160" height="30" rx="12" fill="#e0eaff" />
			<rect x="60" y="30" width="60" height="60" rx="16" fill="#6366f1" opacity="0.18" />
			<rect x="80" y="40" width="20" height="40" rx="6" fill="#2563eb" />
			<rect x="90" y="30" width="8" height="20" rx="4" fill="#818cf8" />
			<circle cx="94" cy="90" r="8" fill="#2563eb" />
			<rect x="70" y="80" width="48" height="8" rx="4" fill="#818cf8" />
		</svg>
	),
	why: (
		<svg width="180" height="120" viewBox="0 0 180 120" fill="none">
			<ellipse cx="90" cy="100" rx="70" ry="12" fill="#e0eaff" />
			<rect x="40" y="30" width="100" height="50" rx="16" fill="#60a5fa" opacity="0.18" />
			<circle cx="70" cy="60" r="18" fill="#6366f1" />
			<circle cx="110" cy="60" r="18" fill="#2563eb" />
			<circle cx="90" cy="50" r="10" fill="#818cf8" />
		</svg>
	),
	mission: (
		<svg width="180" height="120" viewBox="0 0 180 120" fill="none">
			<ellipse cx="90" cy="100" rx="70" ry="12" fill="#e0eaff" />
			<rect x="70" y="30" width="40" height="60" rx="16" fill="#818cf8" opacity="0.18" />
			<path d="M90 40 L110 80 L70 80 Z" fill="#2563eb" />
			<circle cx="90" cy="60" r="8" fill="#60a5fa" />
		</svg>
	),
	team: (
		<svg width="180" height="120" viewBox="0 0 180 120" fill="none">
			<ellipse cx="90" cy="100" rx="70" ry="12" fill="#e0eaff" />
			<circle cx="60" cy="60" r="16" fill="#6366f1" />
			<circle cx="120" cy="60" r="16" fill="#2563eb" />
			<circle cx="90" cy="50" r="12" fill="#818cf8" />
			<rect x="50" y="80" width="80" height="12" rx="6" fill="#60a5fa" />
		</svg>
	),
	security: (
		<svg width="180" height="120" viewBox="0 0 180 120" fill="none">
			<ellipse cx="90" cy="100" rx="70" ry="12" fill="#e0eaff" />
			<rect x="70" y="40" width="40" height="40" rx="12" fill="#2563eb" />
			<rect x="85" y="60" width="10" height="20" rx="5" fill="#818cf8" />
			<circle cx="90" cy="60" r="6" fill="#60a5fa" />
		</svg>
	),
	join: (
		<svg width="180" height="120" viewBox="0 0 180 120" fill="none">
			<ellipse cx="90" cy="100" rx="70" ry="12" fill="#e0eaff" />
			<rect x="60" y="40" width="60" height="40" rx="16" fill="#60a5fa" opacity="0.18" />
			<circle cx="90" cy="60" r="18" fill="#2563eb" />
			<rect x="80" y="50" width="20" height="20" rx="6" fill="#818cf8" />
			<rect x="85" y="70" width="10" height="10" rx="5" fill="#60a5fa" />
		</svg>
	),
	success: (
		<svg width="120" height="120" viewBox="0 0 120 120">
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
	),
	error: (
		<svg width="120" height="120" viewBox="0 0 120 120">
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
	),
	loading: (
		<svg width="60" height="60" viewBox="0 0 60 60" className="mb-6 animate-spin">
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
	),
};

const Illustration: React.FC<{ type: IllustrationType; className?: string }> = ({
	type,
	className,
}) => <span className={className}>{Illustrations[type]}</span>;

export default Illustration;
