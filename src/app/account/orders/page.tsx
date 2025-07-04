"use client";
import { useCallback, useEffect, useState } from "react";
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
import { AlertCircle, RotateCcw } from "lucide-react";
import { iGroupedOrder } from "@/lib/types";
import Container from "@/components/common/container";
import { Button } from "@/components/ui/button";
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
import { fetchOrders, statusColor } from "@/lib/helpers";
import CopyElement from "@/components/CopyElement";
import CustomerAd from "@/components/ads/CustomerAd";
import OrderView from "@/components/OrderView";

export default function UserOrdersPage() {
	const [groupedOrders, setGroupedOrders] = useState<iGroupedOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(15);

	const fetchData = useCallback(async () => {
		setLoading(true);
		const { groupedOrders, error } = await fetchOrders({ page, pageSize });
		if (error) {
			setError(error);
		} else {
			setGroupedOrders(groupedOrders);
		}

		setLoading(false);
	}, [page, pageSize]);

	useEffect(() => {
		fetchData();
	}, [fetchData, page, pageSize]);

	const totalPages = Math.max(1, Math.ceil(groupedOrders.length / pageSize));

	return (
		<Container>
			<div className="max-w-full w-full mx-auto py-10 px-4">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold mb-6">My Orders</h1>
					<Button variant="ghost" size="icon" onClick={fetchData} title="Refetch orders">
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
											<OrderView fetchOrders={fetchData} group={group} />
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
				<CustomerAd variant="banner" />
			</div>
		</Container>
	);
}
