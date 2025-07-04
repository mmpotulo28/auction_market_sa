import { sendNotification, statusColor } from "@/lib/helpers";
import { iGroupedOrder, iOrder, iOrderStatus } from "@/lib/types";
import { Eye } from "lucide-react";
import CopyElement from "../CopyElement";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "../ui/table";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Badge } from "../ui/badge";
import Image from "next/image";
import styles from "./order-view.module.css";

const ORDER_STATUSES = Object.values(iOrderStatus);

interface iOrderViewProps {
	group: iGroupedOrder;
	fetchOrders: () => void;
	admin?: boolean;
}

const OrderView: React.FC<iOrderViewProps> = ({ group, fetchOrders, admin = false }) => {
	const [selectedOrderGroup, setSelectedOrderGroup] = useState<iGroupedOrder | null>(null);
	const [statusUpdating, setStatusUpdating] = useState(false);
	const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
	const [expandedOrder, setExpandedOrder] = useState<iOrder | null>(null);

	const handleExpandOrder = async (order: iOrder) => {
		setExpandedOrder(order);
	};

	const handleStatusChange = async (order: iGroupedOrder, newStatus: iOrderStatus) => {
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
				fetchOrders();

				setExpandedOrder(null);

				// Send notification to user
				if (order.user_id) {
					const notifRes = await sendNotification(
						order.user_id,
						`Order #${order.order_id} status updated to ${newStatus}.`,
						"info",
					);
					if (!notifRes.success) {
						console.error("Notification error:", notifRes.error);
						toast.error(notifRes.error);
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

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setSelectedOrderGroup(group)}
					title="View Order Details">
					<Eye className="w-4 h-4 mr-1" />
				</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-2.5">
				<DialogTitle>
					<CopyElement content={group.order_id} />
				</DialogTitle>
				{selectedOrderGroup && (
					<div className="space-y-4 w-full max-w-[100%] max-h-[80vh]  block">
						<div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
							<div>
								<strong>Order ID:</strong>{" "}
								<CopyElement content={selectedOrderGroup.order_id} />
							</div>
							<div className="flex flex-col">
								<strong>Customer:</strong> {selectedOrderGroup.user_name}
							</div>
							<div className="flex flex-col">
								<strong>Email:</strong>{" "}
								<CopyElement content={selectedOrderGroup.user_email} />
							</div>
							<div className="flex flex-col">
								<strong>Created At:</strong>{" "}
								{new Date(selectedOrderGroup.created_at).toLocaleString()}
							</div>
							<div className="flex flex-col">
								<strong>Items Count:</strong> {selectedOrderGroup.items_count}
							</div>
							<div className="flex flex-col">
								<strong>Total Amount:</strong> R{" "}
								{Number(selectedOrderGroup.total_amount).toFixed(2)}
							</div>
							<div className="flex flex-col">
								<strong>Status:</strong>
								<Badge
									className={`ml-2 ${statusColor(
										selectedOrderGroup.order_status,
									)}`}>
									{selectedOrderGroup.order_status}
								</Badge>
							</div>
							<div className="flex flex-col">
								<strong>Payment ref:</strong>{" "}
								<CopyElement content={group.payment_id} />
							</div>
						</div>

						<div className="w-full">
							<h3 className="text-lg font-semibold mb-3">Order Items</h3>
							<Table className="overflow-x-auto max-w-[100%]">
								<TableHeader>
									<TableRow>
										<TableHead>Item Name</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Item ID</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{selectedOrderGroup.orders.map((order) => (
										<TableRow key={order.id}>
											<TableCell>{order.item_name}</TableCell>
											<TableCell>
												R {Number(order.price).toFixed(2)}
											</TableCell>
											<TableCell>{order.item_id}</TableCell>
											<TableCell>
												<Badge className={statusColor(order.order_status)}>
													{order.order_status}
												</Badge>
											</TableCell>
											<TableCell>
												<Dialog>
													<DialogTrigger asChild>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleExpandOrder(order)}
															title="View Item Details">
															<Eye className="w-4 h-4" />
														</Button>
													</DialogTrigger>
													<DialogContent>
														{expandedOrder && (
															<div className={styles.expandedOrder}>
																<span>
																	{expandedOrder.item?.title} -
																	{" R"}
																	{expandedOrder.item?.price}
																</span>
																<div>
																	<Image
																		src={
																			expandedOrder.item
																				?.image || ""
																		}
																		alt={
																			expandedOrder.item
																				?.title || ""
																		}
																		height={200}
																		width={200}
																	/>
																</div>
															</div>
														)}
													</DialogContent>
												</Dialog>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{selectedOrderGroup && admin && (
							<div className="flex flex-col gap-2 mt-2">
								<label className="font-semibold">Change Status:</label>
								<div
									className="grid gap-2"
									style={{
										gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
									}}>
									{ORDER_STATUSES.map((s) => (
										<Button
											key={s}
											variant={
												selectedOrderGroup.order_status === s
													? "default"
													: "outline"
											}
											size="sm"
											disabled={
												statusUpdating ||
												selectedOrderGroup.order_status === s
											}
											onClick={() =>
												handleStatusChange(
													selectedOrderGroup,
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
	);
};

export default OrderView;
