"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import Illustration from "@/components/Illustration";
import Receipt from "@/components/Reciept";

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
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const receiptRef = useRef<HTMLDivElement>(null);

	const validateTransaction = async (m_payment_id: string) => {
		setStatus("loading");
		setRetrying(true);
		setErrorMsg(null);
		try {
			const res = await axios.get(`/api/payfast/validate?m_payment_id=${m_payment_id}`);
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
				setErrorMsg(
					"We could not verify your payment as completed. If you have paid, please contact support.",
				);
			} else {
				setStatus("notfound");
				setErrorMsg(
					"No transaction found for your payment. Please contact support if you have paid.",
				);
			}
		} catch (e: any) {
			setStatus("error");
			setErrorMsg(
				e?.response?.data?.error ||
					e?.message ||
					"An error occurred while validating your payment. Please try again or contact support.",
			);
		}
		setRetrying(false);
	};

	useEffect(() => {
		const m_payment_id = getCookie("payfast_m_payment_id");
		mPaymentIdRef.current = m_payment_id;
		if (!m_payment_id) {
			setStatus("error");
			setErrorMsg("Missing payment reference. Please try again from your cart.");
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
		<div
			className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4"
			style={{
				background:
					"linear-gradient(135deg, var(--color-background) 60%, var(--color-accent) 100%)",
			}}>
			<div className="bg-card shadow-xl rounded-2xl p-8 max-w-md w-full flex flex-col items-center">
				{status === "loading" && (
					<>
						<Illustration type="loading" />
						<p className="mb-4 text-lg font-medium text-muted-foreground">
							Validating your payment...
						</p>
					</>
				)}
				{status === "success" && (
					<>
						<Illustration type="success" />
						<h1 className="text-2xl font-bold mb-2 text-green-600">
							Payment Successful
						</h1>
						<p className="mb-4 text-base text-muted-foreground">
							Thank you for your payment. Your transaction has been processed.
						</p>
						{transaction && (
							<Receipt receiptRef={receiptRef} transaction={transaction} />
						)}
						<Link
							href="/"
							className="px-6 py-2 rounded bg-accent text-accent-foreground font-semibold shadow hover:bg-accent/90 transition">
							Back to Home
						</Link>
					</>
				)}
				{(status === "notfound" || status === "error") && (
					<>
						<Illustration type="error" />
						<h1 className="text-2xl font-bold mb-2 text-red-600">
							{status === "notfound" ? "Payment Not Completed" : "Error"}
						</h1>
						<p className="mb-4 text-base text-muted-foreground">
							{errorMsg ||
								(status === "notfound"
									? "We could not verify your payment as completed. If you have paid, please contact support."
									: "An error occurred while validating your payment. Please try again or contact support.")}
						</p>
						{retryCount < maxRetries && (
							<button
								className="px-6 py-2 mb-4 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition disabled:opacity-60"
								onClick={handleRetry}
								disabled={retrying}>
								{retrying
									? "Retrying..."
									: `Retry (${maxRetries - retryCount} left)`}
							</button>
						)}
						{retryCount >= maxRetries && (
							<p className="mb-4 text-red-600 font-medium">
								You have reached the maximum number of retries.
							</p>
						)}
						<Link
							href="/"
							className="px-6 py-2 rounded bg-accent text-accent-foreground font-semibold shadow hover:bg-accent/90 transition">
							Back to Home
						</Link>
					</>
				)}
			</div>
		</div>
	);
}
