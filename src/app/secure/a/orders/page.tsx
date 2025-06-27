"use client";
import { useEffect, useState, useCallback } from "react";
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
import { AlertCircle, RefreshCw } from "lucide-react";
import { iGroupedOrder } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Illustration from "@/components/Illustration";
import { fetchOrders, statusColor } from "@/lib/helpers";
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
import OrderView from "@/components/OrderView";

export default function AdminOrdersPage() {
	const [groupedOrders, setGroupedOrders] = useState<iGroupedOrder[]>([]);
	const [filteredGroups, setFilteredGroups] = useState<iGroupedOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize] = useState(15);

	const fetchData = useCallback(async () => {
		setLoading(true);
		const { groupedOrders, error } = await fetchOrders({ page, pageSize });
		if (error) {
			setError(error);
		} else {
			setGroupedOrders(groupedOrders);
			setFilteredGroups(groupedOrders);
		}

		setLoading(false);
	}, [page, pageSize]);

	useEffect(() => {
		fetchData();
	}, [fetchData, page, pageSize]);

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
							onClick={fetchData}
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
										<OrderView fetchOrders={fetchData} group={group} admin />
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
