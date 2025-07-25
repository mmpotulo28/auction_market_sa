"use client";
import { useRef, useState } from "react";
import { AlertCircle, RotateCcw, Package } from "lucide-react";
import CopyElement from "@/components/CopyElement";
import CustomerAd from "@/components/ads/CustomerAd";
import { useAccountContext } from "@/context/AccountContext";
import Illustration from "@/components/Illustration";
import styles from "../orders/orders.module.css";
import Receipt from "@/components/Reciept";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

export default function UserTransactionsPage() {
	const { transactions, fetchTransactions, errorTransactions, loadingTransactions } =
		useAccountContext();
	const ticketRef = useRef(null);

	const [page, setPage] = useState(1);
	const [pageSize] = useState(15);

	const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
	const paginatedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);

	// Calculate stats
	const totalOrders = transactions.length;
	const completedOrders = transactions.filter((txn) => txn.payment_status === "COMPLETE").length;
	const cancelledOrders = transactions.filter((txn) => txn.payment_status === "CANCELLED").length;
	const totalItems = transactions.length;

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
					<h2 className={styles.ordersTitle}>Receipts & Transactions</h2>
				</div>
				{/* Top Bar */}
				<div className={styles.topBar}>
					{/* Stats Cards */}
					<div className={styles.statsCards}>
						<div className={styles.statCard}>
							<h3 className={styles.statNumber}>
								{loadingTransactions ? "?" : totalOrders}
							</h3>
							<p className={styles.statLabel}>Total Orders</p>
						</div>
						<div className={styles.statCard}>
							<h3 className={styles.statNumber}>
								{loadingTransactions ? "?" : completedOrders}
							</h3>
							<p className={styles.statLabel}>Completed</p>
						</div>
						<div className={styles.statCard}>
							<h3 className={styles.statNumber}>
								{loadingTransactions ? "?" : cancelledOrders}
							</h3>
							<p className={styles.statLabel}>Cancelled</p>
						</div>
						<div className={styles.statCard}>
							<h3 className={styles.statNumber}>
								{loadingTransactions ? "?" : totalItems}
							</h3>
							<p className={styles.statLabel}>Total Items</p>
						</div>
					</div>

					{/* Refresh Button */}
					<button
						className={styles.refreshBtn}
						onClick={fetchTransactions}
						title="Refresh orders">
						<RotateCcw size={20} />
					</button>
				</div>

				{/* Error Alert */}
				{errorTransactions && (
					<div className={styles.errorAlert}>
						<AlertCircle size={20} className={styles.errorIcon} />
						<div className={styles.errorContent}>
							<h4>Error</h4>
							<p>{errorTransactions}</p>
						</div>
					</div>
				)}

				{/* Orders List */}
				<div className={styles.ordersSection}>
					<div className={styles.ordersContainer}>
						{loadingTransactions ? (
							<div className={styles.loadingState}>
								<Illustration type="loading" className="m-auto" />
								<p>Loading your orders...</p>
							</div>
						) : transactions.length === 0 ? (
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
								{paginatedTransactions.map((txn) => (
									<div key={txn.m_payment_id} className={styles.orderCard}>
										<div className={styles.orderCardHeader}>
											<div className={styles.orderInfo}>
												<div className={styles.orderNumber}>
													<span className={styles.orderLabel}>
														Payment #
													</span>
													<CopyElement truncate content={txn.item_name} />
												</div>
												<div className={styles.orderDate}>
													{txn.created_at
														? new Date(
																txn.created_at,
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
													} ${getStatusBadgeClass(txn.payment_status)}`}>
													{txn.payment_status}
												</span>
												<Dialog>
													<DialogTrigger>open in new</DialogTrigger>
													<DialogContent>
														<Receipt
															receiptRef={ticketRef}
															transaction={txn}
														/>
													</DialogContent>
												</Dialog>
											</div>
										</div>

										<div className={styles.orderCardBody}>
											<div className={styles.orderDetails}>
												<div className={styles.orderDetail}>
													<span className={styles.detailLabel}>
														Customer
													</span>
													<span className={styles.detailValue}>
														{txn.name_first} {txn.name_last}
													</span>
												</div>
												<div className={styles.orderDetail}>
													<span className={styles.detailLabel}>
														Email
													</span>
													<span className={styles.detailValue}>
														<CopyElement
															content={txn.email_address || ""}
														/>
													</span>
												</div>
												<div className={styles.orderDetail}>
													<span className={styles.detailLabel}>
														Price
													</span>
													<span className={styles.detailValue}>
														R{Number(txn.amount_gross)?.toFixed(2)}
													</span>
												</div>
												<div className={styles.orderDetail}>
													<span className={styles.detailLabel}>Item</span>
													<div className={styles.detailValue}>
														<CopyElement
															truncate
															content={txn.m_payment_id || ""}
														/>
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
