"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface iCopyElement {
	content: string;
	truncate?: boolean;
	truncateWidth?: number;
}

const CopyElement: React.FC<iCopyElement> = ({ content, truncate, truncateWidth }) => {
	const [copied, setCopied] = useState<string | null>(null);

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(text);
			setTimeout(() => setCopied(null), 2000);
		});
	};

	return (
		<span className="flex items-center gap-1">
			<span
				className={`truncate ${truncate ? "max-w-[200px]" : ""}`}
				style={truncate ? { width: truncateWidth } : {}}>
				{content}
			</span>
			<button
				type="button"
				className="ml-1 text-xs text-muted-foreground hover:text-accent"
				onClick={() => handleCopy(content)}
				title="Copy Order ID">
				{copied === content ? <Check size={14} /> : <Copy size={14} />}
			</button>
		</span>
	);
};

export default CopyElement;
