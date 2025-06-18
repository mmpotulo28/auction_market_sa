import Link from "next/link";

export default function PayfastCancel() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
			<h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
			<p className="mb-6">Your payment was cancelled. No funds were deducted.</p>
			<Link
				href="/cart"
				className="px-6 py-2 rounded bg-accent text-accent-foreground font-semibold">
				Back to Cart
			</Link>
		</div>
	);
}
