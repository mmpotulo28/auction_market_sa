"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function PayfastReturn() {
	const searchParams = useSearchParams();
	const [status, setStatus] = useState<"loading" | "success" | "notfound" | "error">("loading");
	const [transaction, setTransaction] = useState<any>(null);

	useEffect(() => {
		const pf_payment_id = searchParams.get("pf_payment_id");
		const m_payment_id = searchParams.get("m_payment_id");
		if (!pf_payment_id && !m_payment_id) {
			setStatus("error");
			return;
		}
		const fetchTx = async () => {
			try {
				const res = await axios.get(
					`/api/payfast/validate?${
						pf_payment_id ? `pf_payment_id=${pf_payment_id}` : ""
					}${m_payment_id ? `&m_payment_id=${m_payment_id}` : ""}`,
				);
				if (
					res.data &&
					res.data.transaction &&
					res.data.transaction.payment_status === "COMPLETE"
				) {
					setTransaction(res.data.transaction);
					setStatus("success");
				} else if (res.data && res.data.transaction) {
					setTransaction(res.data.transaction);
					setStatus("notfound");
				} else {
					setStatus("notfound");
				}
			} catch (e) {
				setStatus("error");
				console.error(e);
			}
		};
		fetchTx();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
			{status === "loading" && (
				<>
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-6" />
					<p className="mb-4 text-lg">Validating your payment...</p>
				</>
			)}
			{status === "success" && (
				<>
					<h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
					<p className="mb-2">
						Thank you for your payment. Your transaction has been processed.
					</p>
					{transaction && (
						<div className="mb-6 text-sm bg-card p-4 rounded shadow">
							<div>
								<b>Reference:</b>{" "}
								{transaction.m_payment_id || transaction.pf_payment_id}
							</div>
							<div>
								<b>Amount:</b> R {transaction.amount_gross}
							</div>
							<div>
								<b>Status:</b> {transaction.payment_status}
							</div>
						</div>
					)}
					<Link
						href="/"
						className="px-6 py-2 rounded bg-accent text-accent-foreground font-semibold">
						Back to Home
					</Link>
				</>
			)}
			{status === "notfound" && (
				<>
					<h1 className="text-3xl font-bold mb-4">Payment Not Completed</h1>
					<p className="mb-6">
						We could not verify your payment as completed. If you have paid, please
						contact support.
					</p>
					<Link
						href="/"
						className="px-6 py-2 rounded bg-accent text-accent-foreground font-semibold">
						Back to Home
					</Link>
				</>
			)}
			{status === "error" && (
				<>
					<h1 className="text-3xl font-bold mb-4">Error</h1>
					<p className="mb-6">
						An error occurred while validating your payment. Please try again or contact
						support.
					</p>
					<Link
						href="/"
						className="px-6 py-2 rounded bg-accent text-accent-foreground font-semibold">
						Back to Home
					</Link>
				</>
			)}
		</div>
	);
}
