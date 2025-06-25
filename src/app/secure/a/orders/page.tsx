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
import { AlertCircle, Eye, RefreshCw } from "lucide-react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Receipt from "@/components/Reciept";
import { iOrder, iAuctionItem, iTransaction, iOrderStatus, iGroupedOrder } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Illustration from "@/components/Illustration";
import { groupOrdersByOrderId, sendNotification, statusColor } from "@/lib/helpers";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import CopyElement from "@/components/CopyElement";

const ORDER_STATUSES = Object.values(iOrderStatus);

// Interface for grouped orders

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<iOrder[]>([]);
	const [groupedOrders, setGroupedOrders] = useState<iGroupedOrder[]>([]);
	const [filteredGroups, setFilteredGroups] = useState<iGroupedOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [selectedOrderGroup, setSelectedOrderGroup] = useState<iGroupedOrder | null>(null);
	const [expandedOrder, setExpandedOrder] = useState<iOrder | null>(null);
	const [itemDetails, setItemDetails] = useState<iAuctionItem | null>(null);
	const [paymentInfo, setPaymentInfo] = useState<iTransaction | null>(null);
	const [statusUpdating, setStatusUpdating] = useState(false);
	const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(15);
	const [, setTotal] = useState(0);

	const fetchOrders = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get(`/api/admin/orders?page=${page}&pageSize=${pageSize}`);
			if (res.data && Array.isArray(res.data.orders)) {
				setOrders(res.data.orders);

				// Group orders by order_id
				const grouped = groupOrdersByOrderId(res.data.orders);
				setGroupedOrders(grouped);
				setFilteredGroups(grouped);

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
			setFilteredGroups(groupedOrders);
			return;
		}
		const s = search.toLowerCase();
		setFilteredGroups(
			groupedOrders.filter(
				(group) =>
					group.order_id?.toLowerCase().includes(s) ||
					group.user_email?.toLowerCase().includes(s) ||
					group.user_name?.toLowerCase().includes(s) ||
					group.order_status?.toLowerCase().includes(s) ||
					group.orders.some(
						(order) =>
							order.item_name?.toLowerCase().includes(s) ||
							order.payment_id?.toLowerCase().includes(s),
					),
			),
		);
	}, [search, groupedOrders]);

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
				// Refresh grouped orders
				const updatedOrders = orders.map((o) =>
					o.id === order.id ? { ...o, order_status: newStatus } : o,
				);
				const grouped = groupOrdersByOrderId(updatedOrders);
				setGroupedOrders(grouped);
				setFilteredGroups(grouped);

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

	const totalPages = Math.max(1, Math.ceil(groupedOrders.length / pageSize));

	return (
		<div className="max-w-full mx-auto py-0 px-4">
			<div className="mb-6 px-0 py-2 ">
				<div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
					<Input
						placeholder="Search by order id, item, email, status, payment id..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-xs"
					/>

					<div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
						<span className="text-muted-foreground text-sm">
							Showing {filteredGroups.length} of {groupedOrders.length} order groups
						</span>

						<Button
							variant="outline"
							size="icon"
							onClick={fetchOrders}
							disabled={loading}
							title="Refresh Orders"
							className="ml-2">
							<RefreshCw className={loading ? "animate-spin" : ""} size={18} />
						</Button>
					</div>
				</div>
			</div>
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
							<TableHead>Order Number</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>User Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Items Count</TableHead>
							<TableHead>Total Amount</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center  ">
									<Illustration type="loading" className="m-auto" />
								</TableCell>
							</TableRow>
						) : filteredGroups.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center">
									No orders found.
								</TableCell>
							</TableRow>
						) : (
							filteredGroups.map((group) => (
								<TableRow key={group.order_id}>
									<TableCell>
										<CopyElement content={group.order_id} />
									</TableCell>
									<TableCell>
										{group.created_at
											? new Date(group.created_at).toLocaleString()
											: "-"}
									</TableCell>
									<TableCell>{group.user_name || "-"}</TableCell>
									<TableCell>
										<CopyElement content={group.user_email || "-"} />
									</TableCell>
									<TableCell>
										<Badge variant="outline">{group.items_count} items</Badge>
									</TableCell>
									<TableCell>R {Number(group.total_amount).toFixed(2)}</TableCell>
									<TableCell>
										<Badge className={statusColor(group.order_status)}>
											{group.order_status}
										</Badge>
									</TableCell>
									<TableCell>
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													onClick={() => setSelectedOrderGroup(group)}
													title="View Order Details">
													<Eye className="w-4 h-4 mr-1" />
													View Order
												</Button>
											</DialogTrigger>
											<DialogContent className="flex flex-col gap-2.5">
												<DialogTitle>
													Order Details - {group.order_id}
												</DialogTitle>
												{selectedOrderGroup && (
													<div className="space-y-4 w-full max-w-[100%] max-h-[80vh]  block">
														<div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
															<div>
																<strong>Order ID:</strong>{" "}
																<CopyElement
																	content={
																		selectedOrderGroup.order_id
																	}
																/>
															</div>
															<div className="flex flex-col">
																<strong>Customer:</strong>{" "}
																{selectedOrderGroup.user_name}
															</div>
															<div className="flex flex-col">
																<strong>Email:</strong>{" "}
																<CopyElement
																	content={
																		selectedOrderGroup.user_email
																	}
																/>
															</div>
															<div className="flex flex-col">
																<strong>Created At:</strong>{" "}
																{new Date(
																	selectedOrderGroup.created_at,
																).toLocaleString()}
															</div>
															<div className="flex flex-col">
																<strong>Items Count:</strong>{" "}
																{selectedOrderGroup.items_count}
															</div>
															<div className="flex flex-col">
																<strong>Total Amount:</strong> R{" "}
																{Number(
																	selectedOrderGroup.total_amount,
																).toFixed(2)}
															</div>
															<div className="flex flex-col">
																<strong>Status:</strong>
																<Badge
																	className={`ml-2 ${statusColor(
																		selectedOrderGroup.order_status,
																	)}`}>
																	{
																		selectedOrderGroup.order_status
																	}
																</Badge>
															</div>
															<div className="flex flex-col">
																<strong>Payment ref:</strong>{" "}
																<CopyElement
																	content={group.payment_id}
																/>
															</div>
														</div>

														<div className="w-full">
															<h3 className="text-lg font-semibold mb-3">
																Order Items
															</h3>
															<Table className="overflow-x-auto max-w-[100%]">
																<TableHeader>
																	<TableRow>
																		<TableHead>
																			Item Name
																		</TableHead>
																		<TableHead>Price</TableHead>
																		<TableHead>
																			Item ID
																		</TableHead>
																		<TableHead>
																			Status
																		</TableHead>
																		<TableHead>
																			Actions
																		</TableHead>
																	</TableRow>
																</TableHeader>
																<TableBody>
																	{selectedOrderGroup.orders.map(
																		(order) => (
																			<TableRow
																				key={order.id}>
																				<TableCell>
																					{
																						order.item_name
																					}
																				</TableCell>
																				<TableCell>
																					R{" "}
																					{Number(
																						order.price,
																					).toFixed(2)}
																				</TableCell>
																				<TableCell>
																					{order.item_id}
																				</TableCell>
																				<TableCell>
																					<Badge
																						className={statusColor(
																							order.order_status,
																						)}>
																						{
																							order.order_status
																						}
																					</Badge>
																				</TableCell>
																				<TableCell>
																					<Dialog>
																						<DialogTrigger
																							asChild>
																							<Button
																								variant="outline"
																								size="sm"
																								onClick={() =>
																									handleExpandOrder(
																										order,
																									)
																								}
																								title="View Item Details">
																								<Eye className="w-4 h-4" />
																							</Button>
																						</DialogTrigger>
																						<DialogContent className="max-w-lg">
																							<DialogTitle>
																								Item
																								Details
																							</DialogTitle>
																							{expandedOrder && (
																								<div className="space-y-3">
																									<div className="flex flex-col gap-2">
																										<div className="flex items-center gap-2">
																											<strong>
																												Order
																												ID:
																											</strong>
																											<CopyElement
																												content={
																													expandedOrder.order_id
																												}
																											/>
																										</div>
																										<div>
																											<strong>
																												User:
																											</strong>{" "}
																											{
																												expandedOrder.user_first_name
																											}{" "}
																											{
																												expandedOrder.user_last_name
																											}{" "}
																											(
																											{
																												expandedOrder.user_email
																											}

																											)
																										</div>
																										<div>
																											<strong>
																												Status:
																											</strong>{" "}
																											<Badge
																												className={statusColor(
																													expandedOrder.order_status,
																												)}>
																												{
																													expandedOrder.order_status
																												}
																											</Badge>
																										</div>
																										<div>
																											<strong>
																												Created:
																											</strong>{" "}
																											{expandedOrder.created_at
																												? new Date(
																														expandedOrder.created_at,
																												  ).toLocaleString()
																												: "-"}
																										</div>
																										<div>
																											<strong>
																												Item:
																											</strong>{" "}
																											{
																												expandedOrder.item_name
																											}
																										</div>
																										<div>
																											<strong>
																												Price:
																											</strong>{" "}
																											R{" "}
																											{expandedOrder.price !==
																											undefined
																												? Number(
																														expandedOrder.price,
																												  ).toFixed(
																														2,
																												  )
																												: ""}
																										</div>
																										<div className="flex items-center gap-2">
																											<strong>
																												Payment
																												Ref:
																											</strong>
																											<CopyElement
																												content={
																													expandedOrder.payment_id
																												}
																											/>
																										</div>
																									</div>

																									{itemDetails && (
																										<div className="mt-4">
																											<strong>
																												Item
																												Details:
																											</strong>
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
																											<strong>
																												Payment
																												Info:
																											</strong>
																											<Receipt
																												transaction={
																													paymentInfo
																												}
																												receiptRef={{
																													current:
																														null,
																												}}
																											/>
																										</div>
																									)}
																								</div>
																							)}
																						</DialogContent>
																					</Dialog>
																				</TableCell>
																			</TableRow>
																		),
																	)}
																</TableBody>
															</Table>
														</div>

														{expandedOrder && (
															<div className="flex flex-col gap-2 mt-2">
																<label className="font-semibold">
																	Change Status:
																</label>
																<div
																	className="grid gap-2"
																	style={{
																		gridTemplateColumns:
																			"repeat(auto-fit, minmax(100px, 1fr))",
																	}}>
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
