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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, RotateCcw } from "lucide-react";
import { iGroupedOrder, iOrder } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Container from "@/components/common/container";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Illustration from "@/components/Illustration";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { groupOrdersByOrderId, statusColor } from "@/lib/helpers";
import CopyElement from "@/components/CopyElement";

export default function UserOrdersPage() {
	const [orders, setOrders] = useState<iOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedOrder, setSelectedOrder] = useState<iGroupedOrder | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [total, setTotal] = useState(0);

	const fetchOrders = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get<{
				orders: iOrder[];
				total: number;
				error?: string;
			}>(`/api/orders/user?page=${page}&pageSize=${pageSize}`);
			const data = res.data;
			if (data.orders) {
				setOrders(data.orders);
				setTotal(data.total || 0);
			} else setError(data.error || "No orders found.");
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				setError(e.response?.data?.error || e.message);
			} else {
				setError("An unexpected error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pageSize]);

	// Group orders by order_id
	const groupedOrders: iGroupedOrder[] = groupOrdersByOrderId(orders);

	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	return (
		<Container>
			<div className="max-w-full w-full mx-auto py-10 px-4">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold mb-6">My Orders</h1>
					<Button
						variant="ghost"
						size="icon"
						onClick={fetchOrders}
						title="Refetch orders">
						<RotateCcw className="w-5 h-5" />
					</Button>
				</div>
				{error && (
					<Alert variant="destructive" className="mb-6">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<Card className="overflow-x-auto p-5">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order Number</TableHead>
								<TableHead>Payment Ref</TableHead>
								<TableHead>User Name</TableHead>
								<TableHead>User Email</TableHead>
								<TableHead>Order Date</TableHead>
								<TableHead>Items</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>View</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<Illustration type="loading" className="m-auto" />
									</TableCell>
								</TableRow>
							) : groupedOrders.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										No orders found.
									</TableCell>
								</TableRow>
							) : (
								groupedOrders.map((group) => (
									<TableRow key={group.order_id}>
										<TableCell>
											{" "}
											<CopyElement content={group.order_id} />
										</TableCell>
										<TableCell>
											<CopyElement content={group.payment_id} />
										</TableCell>
										<TableCell>{group.user_name}</TableCell>
										<TableCell>{group.user_email}</TableCell>
										<TableCell>
											{group.created_at
												? new Date(group.created_at).toLocaleString()
												: "-"}
										</TableCell>
										<TableCell>{group.orders.length}</TableCell>
										<TableCell>
											<Badge className={statusColor(group.order_status)}>
												{group.order_status}
											</Badge>
										</TableCell>
										<TableCell>
											<Dialog>
												<DialogTrigger asChild>
													<button
														type="button"
														className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-foreground border border-gray-200 hover:bg-gray-100 transition"
														onClick={() => setSelectedOrder(group)}
														title="View Order">
														<Eye className="w-4 h-4" />
														<span className="sr-only">View</span>
													</button>
												</DialogTrigger>
												{selectedOrder &&
													selectedOrder.order_id === group.order_id && (
														<DialogContent>
															<DialogTitle>
																Order #{selectedOrder.order_id}
															</DialogTitle>
															<div className="mb-2">
																<b>User:</b>{" "}
																{selectedOrder.user_name}
																<br />
																<b>Date:</b>{" "}
																{selectedOrder.created_at
																	? new Date(
																			selectedOrder.created_at,
																	  ).toLocaleString()
																	: "-"}
																<br />
																<b>Status:</b>{" "}
																<Badge
																	className={statusColor(
																		group.order_status,
																	)}>
																	{selectedOrder.order_status}
																</Badge>
															</div>
															<Table>
																<TableHeader>
																	<TableRow>
																		<TableHead>
																			Item Name
																		</TableHead>
																		<TableHead>
																			Description
																		</TableHead>
																		<TableHead>Price</TableHead>
																	</TableRow>
																</TableHeader>
																<TableBody>
																	{selectedOrder.orders.map(
																		(item) => (
																			<TableRow
																				key={item.item_id}>
																				<TableCell>
																					{item.item_name}
																				</TableCell>
																				<TableCell>
																					{item.meta
																						?.item_description ||
																						"-"}
																				</TableCell>
																				<TableCell>
																					R{" "}
																					{Number(
																						item.price,
																					).toFixed(2)}
																				</TableCell>
																			</TableRow>
																		),
																	)}
																</TableBody>
															</Table>
														</DialogContent>
													)}
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
		</Container>
	);
}
