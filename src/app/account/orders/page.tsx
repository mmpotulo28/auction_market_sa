"use client";
import { useState } from "react";
import { AlertCircle, RotateCcw, Package } from "lucide-react";
import CopyElement from "@/components/CopyElement";
import CustomerAd from "@/components/ads/CustomerAd";
import OrderView from "@/components/OrderView";
import { useAccountContext } from "@/context/AccountContext";
import Illustration from "@/components/Illustration";
import styles from "./orders.module.css";
import { iOrderStatus } from "@/lib/types";

export default function UserOrdersPage() {
	const { orders: groupedOrders, fetchOrders, errorOrders, loadingOrders } = useAccountContext();

	const [page, setPage] = useState(1);
	const [pageSize] = useState(15);

	const totalPages = Math.max(1, Math.ceil(groupedOrders.length / pageSize));
	const paginatedOrders = groupedOrders.slice((page - 1) * pageSize, page * pageSize);

	// Calculate stats
	const totalOrders = groupedOrders.length;
	const completedOrders = groupedOrders.filter(
		(order) => order.order_status === iOrderStatus.Completed,
	).length;
	const pendingOrders = groupedOrders.filter(
		(order) => order.order_status === iOrderStatus.Pending,
	).length;
	const totalItems = groupedOrders.reduce((sum, order) => sum + order.orders.length, 0);

	const getStatusBadgeClass = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return styles.statusCompleted;
			case "pending":
				return styles.statusPending;
			case "cancelled":
				return styles.statusCancelled;
			case "processing":
				return styles.statusProcessing;
			default:
				return styles.statusPending;
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.ordersHeader}>
					<h2 className={styles.ordersTitle}>Order History</h2>
				</div>
				{/* Top Bar */}
				<div className={styles.topBar}>
					{/* Stats Cards */}
					<div className={styles.statsCards}>
						<div className={styles.statCard}>
							<h3 className={styles.statNumber}>
								{loadingOrders ? "?" : totalOrders}
							</h3>
							<p className={styles.statLabel}>Total Orders</p>
						</div>
						<div className={styles.statCard}>
							<h3 className={styles.statNumber}>
								{loadingOrders ? "?" : completedOrders}
							</h3>
							<p className={styles.statLabel}>Completed</p>
						</div>
						<div className={styles.statCard}>
							<h3 className={styles.statNumber}>
								{loadingOrders ? "?" : pendingOrders}
							</h3>
							<p className={styles.statLabel}>Pending</p>
						</div>
						<div className={styles.statCard}>
							<h3 className={styles.statNumber}>
								{loadingOrders ? "?" : totalItems}
							</h3>
							<p className={styles.statLabel}>Total Items</p>
						</div>
					</div>

					{/* Refresh Button */}
					<button
						className={styles.refreshBtn}
						onClick={fetchOrders}
						title="Refresh orders">
						<RotateCcw size={20} />
					</button>
				</div>

				{/* Error Alert */}
				{errorOrders && (
					<div className={styles.errorAlert}>
						<AlertCircle size={20} className={styles.errorIcon} />
						<div className={styles.errorContent}>
							<h4>Error</h4>
							<p>{errorOrders}</p>
						</div>
					</div>
				)}

				{/* Orders List */}
				<div className={styles.ordersSection}>
					<div className={styles.ordersContainer}>
						{loadingOrders ? (
							<div className={styles.loadingState}>
								<Illustration type="loading" className="m-auto" />
								<p>Loading your orders...</p>
							</div>
						) : groupedOrders.length === 0 ? (
							<div className={styles.emptyState}>
								<Package size={64} className={styles.emptyIcon} />
								<h3 className={styles.emptyTitle}>No Orders Found</h3>
								<p className={styles.emptyDescription}>
									You haven&apos;t placed any orders yet. Start shopping to see
									your orders here.
								</p>
							</div>
						) : (
							<div className={styles.ordersList}>
								{paginatedOrders.map((group) => (
									<div key={group.order_id} className={styles.orderCard}>
										<div className={styles.orderCardHeader}>
											<div className={styles.orderInfo}>
												<div className={styles.orderNumber}>
													<span className={styles.orderLabel}>
														Order #
													</span>
													<CopyElement content={group.order_id} />
												</div>
												<div className={styles.orderDate}>
													{group.created_at
														? new Date(
																group.created_at,
														  ).toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
														  })
														: "-"}
												</div>
											</div>
											<div className={styles.orderActions}>
												<span
													className={`${
														styles.statusBadge
													} ${getStatusBadgeClass(group.order_status)}`}>
													{group.order_status}
												</span>
												<OrderView
													fetchOrders={fetchOrders}
													group={group}
												/>
											</div>
										</div>

										<div className={styles.orderCardBody}>
											<div className={styles.orderDetails}>
												<div className={styles.orderDetail}>
													<span className={styles.detailLabel}>
														Customer
													</span>
													<span className={styles.detailValue}>
														{group.user_name}
													</span>
												</div>
												<div className={styles.orderDetail}>
													<span className={styles.detailLabel}>
														Email
													</span>
													<span className={styles.detailValue}>
														<CopyElement content={group.user_email} />
													</span>
												</div>
												<div className={styles.orderDetail}>
													<span className={styles.detailLabel}>
														Items
													</span>
													<span className={styles.detailValue}>
														{group.orders.length} items
													</span>
												</div>
												<div className={styles.orderDetail}>
													<span className={styles.detailLabel}>
														Payment Ref
													</span>
													<div className={styles.detailValue}>
														<CopyElement content={group.payment_id} />
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className={styles.pagination}>
							<button
								className={`${styles.paginationBtn} ${
									page === 1 ? styles.disabled : ""
								}`}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}>
								Previous
							</button>

							{[...Array(totalPages)].map((_, idx) => {
								const pageNum = idx + 1;
								if (
									pageNum === 1 ||
									pageNum === totalPages ||
									(pageNum >= page - 1 && pageNum <= page + 1)
								) {
									return (
										<button
											key={pageNum}
											className={`${styles.paginationBtn} ${
												page === pageNum ? styles.active : ""
											}`}
											onClick={() => setPage(pageNum)}>
											{pageNum}
										</button>
									);
								} else if (
									(pageNum === page - 2 && page > 3) ||
									(pageNum === page + 2 && page < totalPages - 2)
								) {
									return (
										<span
											key={pageNum + "-ellipsis"}
											className={styles.paginationEllipsis}>
											...
										</span>
									);
								}
								return null;
							})}

							<button
								className={`${styles.paginationBtn} ${
									page === totalPages ? styles.disabled : ""
								}`}
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}>
								Next
							</button>
						</div>
					)}
				</div>

				<CustomerAd variant="banner" />
			</div>
		</div>
	);
}
