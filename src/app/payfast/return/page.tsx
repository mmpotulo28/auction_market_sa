"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import Illustration from "@/components/Illustration";
import Receipt from "@/components/Reciept";
import { sendNotification } from "@/lib/helpers";

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

	const updateOrderStatus = useCallback(async (orderId: string, status: "PENDING" | "FAILED") => {
		if (!orderId) return { success: false, error: "Missing order id" };
		try {
			const res = await axios.put("/api/orders/status", {
				order_id: orderId,
				status,
			});
			if (res.data && res.data.success) {
				return { success: true };
			} else {
				return { success: false, error: res.data?.error || "Unknown error updating order" };
			}
		} catch (e: any) {
			return {
				success: false,
				error: e?.response?.data?.error || e?.message || "Failed to update order status.",
			};
		}
	}, []);

	const validateTransaction = useCallback(
		async (m_payment_id: string) => {
			setStatus("loading");
			setRetrying(true);

			try {
				setErrorMsg("Validating your payment...");
				const res = await axios.get(`/api/payfast/validate?m_payment_id=${m_payment_id}`);
				if (
					res.data &&
					res.data.transaction &&
					res.data.transaction.payment_status === "COMPLETE"
				) {
					setTransaction(res.data.transaction);
					const orderId = res.data.transaction.custom_str2;
					const userId = res.data.transaction.custom_str1;
					if (orderId) {
						setErrorMsg("Updating your order...");
						const updateRes = await updateOrderStatus(orderId, "PENDING");
						if (updateRes.success) {
							setStatus("success");
							// Send notification for payment success
							if (userId) {
								const notifRes = await sendNotification(
									userId,
									`Payment successful for order #${orderId}.`,
									"success",
								);
								if (!notifRes.success) {
									console.error("Notification error:", notifRes.error);
								}
							}
						} else {
							setStatus("error");
							setErrorMsg(
								"Payment was successful, but failed to update order status: " +
									updateRes.error,
							);
						}
					} else {
						setStatus("error");
						setErrorMsg("Payment was successful, but order reference is missing.");
					}
				} else if (res.data && res.data.transaction) {
					setTransaction(res.data.transaction);
					const orderId = res.data.transaction.custom_str2;
					const userId = res.data.transaction.custom_str1;
					if (orderId) {
						const updateRes = await updateOrderStatus(orderId, "FAILED");
						// Send notification for payment failure
						if (userId) {
							const notifRes = await sendNotification(
								userId,
								`Payment failed for order #${orderId}.`,
								"error",
							);
							if (!notifRes.success) {
								console.error("Notification error:", notifRes.error);
							}
						}
						if (!updateRes.success) {
							setErrorMsg(
								"We could not verify your payment as completed, and also failed to update order status: " +
									updateRes.error,
							);
						} else {
							setErrorMsg(
								"We could not verify your payment as completed. If you have paid, please contact support.",
							);
						}
					} else {
						setErrorMsg(
							"We could not verify your payment as completed. If you have paid, please contact support.",
						);
					}
					setStatus("notfound");
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
		},
		[updateOrderStatus],
	);

	useEffect(() => {
		const m_payment_id = getCookie("payfast_m_payment_id");
		mPaymentIdRef.current = m_payment_id;
		if (!m_payment_id) {
			setStatus("error");
			setErrorMsg("Missing payment reference. Please try again from your cart.");
			return;
		}
		validateTransaction(m_payment_id);
	}, [validateTransaction]);

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
							{errorMsg && <span>{errorMsg}</span>}
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
