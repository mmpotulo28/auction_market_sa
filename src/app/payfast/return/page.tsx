"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

function getCookie(name: string): string | null {
	if (typeof document === "undefined") return null;
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
	return null;
}

export default function PayfastReturn() {
	const [status, setStatus] = useState<"loading" | "success" | "notfound" | "error">("loading");
	const [transaction, setTransaction] = useState<any>(null);
	const [retryCount, setRetryCount] = useState(0);
	const maxRetries = 3;
	const [retrying, setRetrying] = useState(false);
	const mPaymentIdRef = useRef<string | null>(null);

	const validateTransaction = async (m_payment_id: string) => {
		setStatus("loading");
		setRetrying(true);
		let res: any;
		try {
			res = await axios.get(`/api/payfast/validate?m_payment_id=${m_payment_id}`);
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
			let msg = "An unknown error occurred";
			if (axios.isAxiosError(e)) {
				msg = e.response?.data?.message || msg;
			} else if (res.status === 404) {
				msg = `Transaction ${m_payment_id} not found`;
			} else {
				msg = `Error ${res.status}: ${res.statusText}`;
			}
			console.error("Error fetching transaction:", msg, e);
			toast.error(msg);
		}
		setRetrying(false);
	};

	useEffect(() => {
		const m_payment_id = getCookie("payfast_m_payment_id");
		mPaymentIdRef.current = m_payment_id;
		if (!m_payment_id) {
			setStatus("error");
			return;
		}
		validateTransaction(m_payment_id);
	}, []);

	const handleRetry = () => {
		if (retryCount < maxRetries && mPaymentIdRef.current) {
			setRetryCount((prev) => prev + 1);
			validateTransaction(mPaymentIdRef.current);
		}
	};

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
			{(status === "notfound" || status === "error") && (
				<>
					<h1 className="text-3xl font-bold mb-4">
						{status === "notfound" ? "Payment Not Completed" : "Error"}
					</h1>
					<p className="mb-6">
						{status === "notfound"
							? "We could not verify your payment as completed. If you have paid, please contact support."
							: "An error occurred while validating your payment. Please try again or contact support."}
					</p>
					{retryCount < maxRetries && (
						<button
							className="px-6 py-2 mb-4 rounded bg-primary text-primary-foreground font-semibold disabled:opacity-60"
							onClick={handleRetry}
							disabled={retrying}>
							{retrying ? "Retrying..." : `Retry (${maxRetries - retryCount} left)`}
						</button>
					)}
					{retryCount >= maxRetries && (
						<p className="mb-4 text-red-600">
							You have reached the maximum number of retries.
						</p>
					)}
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
