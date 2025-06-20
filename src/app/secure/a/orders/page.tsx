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
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, Copy, Check, RefreshCw } from "lucide-react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Receipt from "@/components/Reciept";
import { iOrder, iAuctionItem, iTransaction, iOrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Illustration from "@/components/Illustration";
import { sendNotification } from "@/lib/helpers";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";

const ORDER_STATUSES = Object.values(iOrderStatus);

function statusColor(status: iOrderStatus) {
	switch (status) {
		case iOrderStatus.Completed:
		case iOrderStatus.Pending:
			return "bg-green-100 text-green-700";
		case iOrderStatus.Cancelled:
		case iOrderStatus.Failed:
			return "bg-red-100 text-red-700";
		case iOrderStatus.Unpaid:
		default:
			return "bg-yellow-100 text-yellow-700";
	}
}

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<iOrder[]>([]);
	const [filtered, setFiltered] = useState<iOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [expandedOrder, setExpandedOrder] = useState<iOrder | null>(null);
	const [itemDetails, setItemDetails] = useState<iAuctionItem | null>(null);
	const [paymentInfo, setPaymentInfo] = useState<iTransaction | null>(null);
	const [statusUpdating, setStatusUpdating] = useState(false);
	const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
	const [copied, setCopied] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(15);
	const [total, setTotal] = useState(0);

	const fetchOrders = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get(`/api/admin/orders?page=${page}&pageSize=${pageSize}`);
			if (res.data && Array.isArray(res.data.orders)) {
				setOrders(res.data.orders);
				setFiltered(res.data.orders);
				setTotal(res.data.total || res.data.orders.length);
			} else {
				setError("Invalid response from server.");
			}
		} catch (e: any) {
			let msg = "Failed to fetch orders.";
			if (e?.response?.data?.error) msg = e.response.data.error;
			else if (e?.message) msg = e.message;
			setError(msg);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pageSize]);

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
		setStatusUpdateError(null);
		try {
			const [itemRes, paymentRes] = await Promise.all([
				axios.get<{ item: iAuctionItem }>(`/api/items/item?id=${order.item_id}`),
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

	const handleStatusChange = async (order: iOrder, newStatus: iOrderStatus) => {
		setStatusUpdating(true);
		setStatusUpdateError(null);
		try {
			const res = await axios.put("/api/orders/status", {
				order_id: order.order_id,
				status: newStatus,
			});
			if (res.data && res.data.success) {
				toast.success("Order status updated!");
				// Update local state for immediate feedback
				setOrders((prev) =>
					prev.map((o) => (o.id === order.id ? { ...o, order_status: newStatus } : o)),
				);
				setFiltered((prev) =>
					prev.map((o) => (o.id === order.id ? { ...o, order_status: newStatus } : o)),
				);
				setExpandedOrder((prev) => (prev ? { ...prev, order_status: newStatus } : prev));
				// Send notification to user
				if (order.user_id) {
					const notifRes = await sendNotification(
						order.user_id,
						`Order #${order.order_id} status updated to ${newStatus}.`,
						"info",
					);
					if (!notifRes.success) {
						console.error("Notification error:", notifRes.error);
					}
				}
			} else {
				setStatusUpdateError(res.data?.error || "Failed to update order status.");
			}
		} catch (e: any) {
			setStatusUpdateError(
				e?.response?.data?.error || e?.message || "Failed to update order status.",
			);
		}
		setStatusUpdating(false);
	};

	const handleCopy = (value: string) => {
		navigator.clipboard.writeText(value);
		setCopied(value);
		setTimeout(() => setCopied(null), 1200);
	};

	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	return (
		<div className="max-w-full mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
				All Orders
				<Button
					variant="outline"
					size="icon"
					onClick={fetchOrders}
					disabled={loading}
					title="Refresh Orders"
					className="ml-2">
					<RefreshCw className={loading ? "animate-spin" : ""} size={18} />
				</Button>
			</h1>
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
								<TableCell colSpan={9} className="text-center  ">
									<Illustration type="loading" className="m-auto" />
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
									<TableCell>
										<span className="flex items-center gap-1">
											{o.order_id}
											<button
												type="button"
												className="ml-1 text-xs text-muted-foreground hover:text-accent"
												onClick={() => handleCopy(o.order_id)}
												title="Copy Order ID">
												{copied === o.order_id ? (
													<Check size={14} />
												) : (
													<Copy size={14} />
												)}
											</button>
										</span>
									</TableCell>
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
									<TableCell>
										<Badge className={statusColor(o.order_status)}>
											{o.order_status}
										</Badge>
									</TableCell>
									<TableCell>
										<span className="flex items-center gap-1 font-mono text-xs">
											{o.payment_id || "-"}
											{o.payment_id && (
												<button
													type="button"
													className="ml-1 text-xs text-muted-foreground hover:text-accent"
													onClick={() => handleCopy(o.payment_id)}
													title="Copy Payment ID">
													{copied === o.payment_id ? (
														<Check size={14} />
													) : (
														<Copy size={14} />
													)}
												</button>
											)}
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
											<DialogContent className="max-w-lg">
												<DialogTitle>Order Details</DialogTitle>
												{expandedOrder && (
													<div className="space-y-3">
														<div className="flex flex-col gap-2">
															<div className="flex items-center gap-2">
																<strong>Order ID:</strong>
																<span className="font-mono">
																	{expandedOrder.order_id}
																</span>
																<button
																	type="button"
																	className="ml-1 text-xs text-muted-foreground hover:text-accent"
																	onClick={() =>
																		handleCopy(
																			expandedOrder.order_id,
																		)
																	}
																	title="Copy Order ID">
																	{copied ===
																	expandedOrder.order_id ? (
																		<Check size={14} />
																	) : (
																		<Copy size={14} />
																	)}
																</button>
															</div>
															<div>
																<strong>User:</strong>{" "}
																{expandedOrder.user_first_name}{" "}
																{expandedOrder.user_last_name} (
																{expandedOrder.user_email})
															</div>
															<div>
																<strong>Status:</strong>{" "}
																<Badge
																	className={statusColor(
																		expandedOrder.order_status,
																	)}>
																	{expandedOrder.order_status}
																</Badge>
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
															<div className="flex items-center gap-2">
																<strong>Payment Ref:</strong>
																<span className="font-mono">
																	{expandedOrder.payment_id ||
																		"-"}
																</span>
																{expandedOrder.payment_id && (
																	<button
																		type="button"
																		className="ml-1 text-xs text-muted-foreground hover:text-accent"
																		onClick={() =>
																			handleCopy(
																				expandedOrder.payment_id!,
																			)
																		}
																		title="Copy Payment ID">
																		{copied ===
																		expandedOrder.payment_id ? (
																			<Check size={14} />
																		) : (
																			<Copy size={14} />
																		)}
																	</button>
																)}
															</div>
														</div>
														<div className="flex flex-col gap-2 mt-2">
															<label className="font-semibold">
																Change Status:
															</label>
															<div className="flex gap-2 flex-wrap">
																{ORDER_STATUSES.map((s) => (
																	<Button
																		key={s}
																		variant={
																			expandedOrder.order_status ===
																			s
																				? "default"
																				: "outline"
																		}
																		size="sm"
																		disabled={
																			statusUpdating ||
																			expandedOrder.order_status ===
																				s
																		}
																		onClick={() =>
																			handleStatusChange(
																				expandedOrder,
																				s as iOrderStatus,
																			)
																		}>
																		{s}
																	</Button>
																))}
															</div>
															{statusUpdateError && (
																<div className="text-red-600 text-xs mt-1">
																	{statusUpdateError}
																</div>
															)}
														</div>
														{itemDetails && (
															<div className="mt-4">
																<strong>Item Details:</strong>
																<pre className="bg-muted p-2 rounded text-xs mt-1 overflow-x-auto">
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
				<Pagination className="mt-4">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								aria-disabled={page === 1}
								className={page === 1 ? "pointer-events-none opacity-50" : ""}
							/>
						</PaginationItem>
						{[...Array(totalPages)].map((_, idx) => {
							const pageNum = idx + 1;
							if (
								pageNum === 1 ||
								pageNum === totalPages ||
								(pageNum >= page - 1 && pageNum <= page + 1)
							) {
								return (
									<PaginationItem key={pageNum}>
										<PaginationLink
											onClick={() => setPage(pageNum)}
											isActive={page === pageNum}>
											{pageNum}
										</PaginationLink>
									</PaginationItem>
								);
							} else if (
								(pageNum === page - 2 && page > 3) ||
								(pageNum === page + 2 && page < totalPages - 2)
							) {
								return (
									<PaginationItem key={pageNum + "-ellipsis"}>
										<PaginationEllipsis />
									</PaginationItem>
								);
							}
							return null;
						})}
						<PaginationItem>
							<PaginationNext
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								aria-disabled={page === totalPages}
								className={
									page === totalPages ? "pointer-events-none opacity-50" : ""
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</Card>
		</div>
	);
}
