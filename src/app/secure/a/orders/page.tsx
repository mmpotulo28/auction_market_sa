"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableCaption,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye } from "lucide-react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Receipt from "@/components/Reciept";
import { iOrder, iAuctionItem, iTransaction } from "@/lib/types";

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<iOrder[]>([]);
	const [filtered, setFiltered] = useState<iOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [expandedOrder, setExpandedOrder] = useState<iOrder | null>(null);
	const [itemDetails, setItemDetails] = useState<iAuctionItem | null>(null);
	const [paymentInfo, setPaymentInfo] = useState<iTransaction | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		axios
			.get("/api/admin/orders")
			.then((res) => {
				if (res.data && Array.isArray(res.data.orders)) {
					setOrders(res.data.orders);
					setFiltered(res.data.orders);
				} else {
					setError("Invalid response from server.");
				}
			})
			.catch((e) => {
				let msg = "Failed to fetch orders.";
				if (e?.response?.data?.error) msg = e.response.data.error;
				else if (e?.message) msg = e.message;
				setError(msg);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (!search) {
			setFiltered(orders);
			return;
		}
		const s = search.toLowerCase();
		setFiltered(
			orders.filter(
				(o) =>
					o.id?.toString().includes(s) ||
					o.user_email?.toLowerCase().includes(s) ||
					o.item_name?.toLowerCase().includes(s) ||
					o.order_status?.toLowerCase().includes(s) ||
					o.payment_id?.toLowerCase().includes(s),
			),
		);
	}, [search, orders]);

	const handleExpandOrder = async (order: iOrder) => {
		setExpandedOrder(order);
		setItemDetails(null);
		setPaymentInfo(null);
		try {
			const [itemRes, paymentRes] = await Promise.all([
				axios.get<{ item: iAuctionItem }>(`/api/items/${order.item_id}`),
				order.payment_id
					? axios.get<{ transaction: iTransaction }>(
							`/api/payfast/validate?m_payment_id=${order.payment_id}`,
					  )
					: Promise.resolve({ data: { transaction: null } }),
			]);
			setItemDetails(itemRes.data?.item || null);
			setPaymentInfo(paymentRes.data?.transaction || null);
		} catch (e: any) {
			console.error("Error fetching item or payment info:", e);
			setItemDetails(null);
			setPaymentInfo(null);
		}
	};

	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6">All Orders</h1>
			<Card className="mb-6 p-4">
				<div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
					<Input
						placeholder="Search by order id, item, email, status, payment id..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-xs"
					/>
					<span className="text-muted-foreground text-sm">
						Showing {filtered.length} of {orders.length} orders
					</span>
				</div>
			</Card>
			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Card className="overflow-x-auto p-0">
				<Table>
					<TableCaption>All orders</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Item</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Payment Ref</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Expand</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={9} className="text-center">
									Loading...
								</TableCell>
							</TableRow>
						) : filtered.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9} className="text-center">
									No orders found.
								</TableCell>
							</TableRow>
						) : (
							filtered.map((o) => (
								<TableRow key={o.id}>
									<TableCell>{o.id}</TableCell>
									<TableCell>
										{o.created_at
											? new Date(o.created_at).toLocaleString()
											: "-"}
									</TableCell>
									<TableCell>
										{o.user_first_name || ""} {o.user_last_name || ""}
									</TableCell>
									<TableCell>{o.user_email || "-"}</TableCell>
									<TableCell>{o.item_name}</TableCell>
									<TableCell>{o.order_status}</TableCell>
									<TableCell>
										<span className="font-mono text-xs">
											{o.payment_id || "-"}
										</span>
									</TableCell>
									<TableCell>
										{o.price !== undefined
											? `R ${Number(o.price).toFixed(2)}`
											: ""}
									</TableCell>
									<TableCell>
										<Dialog>
											<DialogTrigger asChild>
												<button
													type="button"
													className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-foreground border border-gray-200 hover:bg-gray-100 transition"
													onClick={() => handleExpandOrder(o)}
													title="Expand Order">
													<Eye className="w-4 h-4" />
													<span className="sr-only">Expand</span>
												</button>
											</DialogTrigger>
											<DialogContent>
												<DialogTitle>Order Details</DialogTitle>
												{expandedOrder && (
													<div className="space-y-2">
														<div>
															<strong>Order ID:</strong>{" "}
															{expandedOrder.id}
														</div>
														<div>
															<strong>User:</strong>{" "}
															{expandedOrder.user_first_name}{" "}
															{expandedOrder.user_last_name} (
															{expandedOrder.user_email})
														</div>
														<div>
															<strong>Status:</strong>{" "}
															{expandedOrder.order_status}
														</div>
														<div>
															<strong>Created:</strong>{" "}
															{expandedOrder.created_at
																? new Date(
																		expandedOrder.created_at,
																  ).toLocaleString()
																: "-"}
														</div>
														<div>
															<strong>Item:</strong>{" "}
															{expandedOrder.item_name}
														</div>
														<div>
															<strong>Price:</strong> R{" "}
															{expandedOrder.price !== undefined
																? Number(
																		expandedOrder.price,
																  ).toFixed(2)
																: ""}
														</div>
														<div>
															<strong>Payment Ref:</strong>{" "}
															{expandedOrder.payment_id || "-"}
														</div>
														{itemDetails && (
															<div className="mt-4">
																<strong>Item Details:</strong>
																<pre className="bg-muted p-2 rounded text-xs mt-1">
																	{JSON.stringify(
																		itemDetails,
																		null,
																		2,
																	)}
																</pre>
															</div>
														)}
														{paymentInfo && (
															<div className="mt-4">
																<strong>Payment Info:</strong>
																<Receipt
																	transaction={paymentInfo}
																	receiptRef={{ current: null }}
																/>
															</div>
														)}
													</div>
												)}
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
