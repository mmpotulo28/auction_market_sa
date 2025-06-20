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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { iOrder } from "@/lib/types";
import Container from "@/components/common/container";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function UserOrdersPage() {
	const [orders, setOrders] = useState<iOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
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

	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	return (
		<Container>
			<div className="max-w-full mx-auto py-10 px-4">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold">My Orders</h1>
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
				<Card className="overflow-x-auto p-0">
					<Table>
						<TableCaption>Your order history</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Item</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Price</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center">
										Loading...
									</TableCell>
								</TableRow>
							) : orders.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center">
										No orders found.
									</TableCell>
								</TableRow>
							) : (
								orders.map((o) => (
									<TableRow key={o.id}>
										<TableCell>{o.order_id}</TableCell>
										<TableCell>
											{o.created_at
												? new Date(o.created_at).toLocaleString()
												: "-"}
										</TableCell>
										<TableCell>{o.item_name}</TableCell>
										<TableCell>
											<Badge>{o.order_status}</Badge>
										</TableCell>
										<TableCell>
											{o.price !== undefined
												? `R ${Number(o.price).toFixed(2)}`
												: ""}
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
