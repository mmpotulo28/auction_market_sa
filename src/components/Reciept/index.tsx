import html2canvas from "html2canvas";
import { ChevronDown, Copy, Download, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface iReceiptProps {
	transaction: any;
	receiptRef: React.RefObject<HTMLDivElement | null>;
}

const Receipt: React.FC<iReceiptProps> = ({ transaction, receiptRef }) => {
	const [showReceipt, setShowReceipt] = useState(false);

	const handleCopyReceipt = () => {
		if (!transaction) return;
		const lines = [
			"AUCTION MARKET SA - Store Receipt",
			`Date: ${
				transaction.created_at
					? new Date(transaction.created_at).toLocaleString()
					: new Date().toLocaleString()
			}`,
			`Ref: ${transaction.m_payment_id || transaction.pf_payment_id}`,
			`Status: ${transaction.payment_status}`,
			`Item: ${transaction.item_name}`,
			transaction.item_description ? `Description: ${transaction.item_description}` : "",
			`Net Amount: R ${
				transaction.amount_net !== undefined
					? Number(transaction.amount_net).toFixed(2)
					: ""
			}`,
			`+ Fees: R ${
				transaction.amount_fee !== undefined
					? Math.abs(Number(transaction.amount_fee)).toFixed(2)
					: ""
			}`,
			`Total Paid: R ${
				transaction.amount_gross !== undefined
					? Number(transaction.amount_gross).toFixed(2)
					: ""
			}`,
			"Thank you for shopping with us!",
			"Powered by Auction Market SA",
		]
			.filter(Boolean)
			.join("\n");
		navigator.clipboard.writeText(lines);
	};

	const handleDownloadReceipt = async () => {
		if (!receiptRef.current) return;
		const canvas = await html2canvas(receiptRef.current, { backgroundColor: "#fff" });
		const link = document.createElement("a");
		link.download = "receipt.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	};

	return (
		<div
			ref={receiptRef}
			className="mb-6 w-full mx-auto border border-dashed border-gray-400 bg-white text-gray-800 rounded-lg shadow receipt"
			style={{
				fontFamily: "monospace, monospace",
				padding: "1.5rem 1.0rem 0.5rem 1.0rem",
				background:
					"repeating-linear-gradient(180deg, #fff, #fff 28px, #f3f4f6 28px, #f3f4f6 30px)",
			}}>
			{/* Collapsed view */}
			{!showReceipt ? (
				<>
					<div className="flex justify-between mb-1">
						<span>Item</span>
						<span className="truncate max-w-[120px] text-right">
							{transaction.item_name}
						</span>
					</div>
					<div className="flex justify-between mb-1">
						<span>Ref</span>
						<span>{transaction.m_payment_id || transaction.pf_payment_id}</span>
					</div>
					<div className="flex justify-between mb-1 font-bold border-t border-dashed border-gray-400 pt-2">
						<span>Total Paid</span>
						<span>
							R{" "}
							{transaction.amount_gross !== undefined
								? Number(transaction.amount_gross).toFixed(2)
								: ""}
						</span>
					</div>
					<button
						className="flex items-center justify-center w-full mt-4 text-accent hover:underline"
						onClick={() => setShowReceipt(true)}
						aria-label="Show full receipt">
						<ChevronDown className="w-5 h-5" />
					</button>
				</>
			) : (
				<>
					<div className="text-center mb-2 font-bold text-lg tracking-widest">
						AUCTION MARKET SA
					</div>
					<div className="text-center text-xs mb-4 text-gray-500">
						Transaction Receipt
					</div>
					<div className="flex justify-between mb-1">
						<span>Date</span>
						<span>
							{transaction.created_at
								? new Date(transaction.created_at).toLocaleString()
								: new Date().toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between mb-1">
						<span>Ref</span>
						<span>{transaction.m_payment_id || transaction.pf_payment_id}</span>
					</div>
					<div className="flex justify-between mb-1">
						<span>Status</span>
						<span className="font-semibold text-green-600">
							{transaction.payment_status}
						</span>
					</div>
					<div className="flex justify-between mb-1">
						<span>Item</span>
						<span className="truncate max-w-[120px] text-right">
							{transaction.item_name}
						</span>
					</div>
					<div className="border-t border-dashed border-gray-400 my-3" />
					<div className="flex justify-between mb-1 font-semibold">
						<span>Net Amount</span>
						<span>
							R{" "}
							{transaction.amount_net !== undefined
								? Number(transaction.amount_net).toFixed(2)
								: ""}
						</span>
					</div>
					<div className="flex justify-between mb-1">
						<span>+ Fees</span>
						<span>
							R{" "}
							{transaction.amount_fee !== undefined
								? Math.abs(Number(transaction.amount_fee)).toFixed(2)
								: ""}
						</span>
					</div>
					<div className="flex justify-between mb-1 font-bold border-t border-dashed border-gray-400 pt-2">
						<span>Total Paid</span>
						<span>
							R{" "}
							{transaction.amount_gross !== undefined
								? Number(transaction.amount_gross).toFixed(2)
								: ""}
						</span>
					</div>
					<div className="border-t border-dashed border-gray-400 my-3" />
					<div className="text-center text-xs text-gray-400 mb-1">
						Thank you for shopping with us!
					</div>
					<div className="text-center text-[10px] text-gray-300">
						Powered by Auction Market SA
					</div>
					<div className="flex gap-2 mt-4 justify-center">
						<button
							type="button"
							className="flex items-center gap-1 px-3 py-1 rounded bg-muted text-foreground border border-gray-200 hover:bg-gray-100 transition"
							onClick={handleCopyReceipt}>
							<Copy className="w-4 h-4" /> Copy
						</button>
						<button
							type="button"
							className="flex items-center gap-1 px-3 py-1 rounded bg-muted text-foreground border border-gray-200 hover:bg-gray-100 transition"
							onClick={handleDownloadReceipt}
							disabled>
							<Download className="w-4 h-4" /> Download
						</button>
					</div>
					<button
						className="flex items-center justify-center w-full mt-2 text-accent hover:underline"
						onClick={() => setShowReceipt(false)}
						aria-label="Hide full receipt">
						<ChevronUp className="w-5 h-5" />
					</button>
				</>
			)}
		</div>
	);
};

export default Receipt;
