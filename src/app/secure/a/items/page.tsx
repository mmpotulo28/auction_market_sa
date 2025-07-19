"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	ColumnDef,
	SortingState,
	ColumnFiltersState,
	VisibilityState,
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

import { DeleteIcon, Edit, PlusCircle } from "lucide-react";
import AddNewItemForm from "@/components/dashboard/AddNewItemForm/page";
import Illustration from "@/components/Illustration";
import styles from "./items.module.css";
import { logger } from "@sentry/nextjs";
import { iAuction, iAuctionItem } from "@/lib/types";
import { AddItemData } from "@/lib/dbFunctions";

const ItemsPage: React.FC = () => {
	const [items, setItems] = useState<iAuctionItem[]>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [auctions, setAuctions] = useState<iAuction[]>([]);
	const [formData, setFormData] = useState<AddItemData>({
		id: "",
		title: "",
		description: "",
		price: "0",
		category: "",
		condition: "new",
		imageFile: null,
		auctionId: "",
	});

	// Fetch items
	const fetchItems = async () => {
		setIsLoading(true);
		try {
			const [itemsRes, auctionsRes] = await Promise.all([
				axios.get("/api/items"),
				axios.get("/api/auctions"),
			]);

			setItems(itemsRes.data.items || []);
			setAuctions(auctionsRes.data || []);
		} catch (e: any) {
			toast.error("Failed to fetch items.");
			console.error("(fetchItems):\n", e);
			logger.error("[fetchItems] Error fetching items:", { error: e });
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchItems();
	}, []);

	// Handle delete item
	const handleDelete = async (id: string) => {
		if (!confirm("Delete this item?")) return;
		setIsLoading(true);
		try {
			await axios.delete("/api/items", { data: { id } });
			toast.success("Item deleted!");
			fetchItems();
		} catch (e: any) {
			toast.error(e?.response?.data?.error || "Failed to delete item.");
		}
		setIsLoading(false);
	};

	// Handle edit item
	const handleEdit = async (item: any) => {
		setFormData(item);
		setIsEditMode(true);
		setIsDialogOpen(true);
	};

	// Handle add new item
	const handleAddNew = () => {
		setFormData({
			id: "",
			title: "",
			description: "",
			price: "",
			category: "",
			condition: "new",
			imageFile: null,
			auctionId: "",
		});
		setIsEditMode(false);
		setIsDialogOpen(true);
	};

	// Create or update item
	const handleSubmit = async ({ e, data }: { e: React.FormEvent; data: AddItemData }) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (isEditMode) {
				await axios.put("/api/items", { item: data });
				toast.success("Item updated!");
			} else {
				await axios.post("/api/items", { item: data });
				toast.success("Item created!");
			}

			setFormData(data);
			setIsDialogOpen(false);
			fetchItems();
		} catch (e: any) {
			toast.error(e?.response?.data?.error || "Failed to save item.");
		}
		setIsLoading(false);
	};

	// Define columns for DataTable
	const columns: ColumnDef<any>[] = [
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "description",
			header: "Description",
		},
		{
			accessorKey: "price",
			header: "Price",
			cell: ({ row }) => `R${parseFloat(row.getValue("price")).toFixed(2)}`,
		},
		{
			accessorKey: "category",
			header: "Category",
		},
		{
			accessorKey: "condition",
			header: "Condition",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }: any) => (
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => handleEdit(row.original)}>
						<Edit className="mr-2" />
					</Button>
					<Button variant="destructive" onClick={() => handleDelete(row.original.id)}>
						<DeleteIcon className="mr-2" />
					</Button>
				</div>
			),
		},
	];

	// Initialize table
	const table = useReactTable({
		data: items,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className={styles.container}>
			<h1 className="text-2xl font-bold mb-4">Items Dashboard</h1>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter by title..."
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
					className="max-w-sm"
				/>
				<Button variant="secondary" className="ml-auto" onClick={handleAddNew}>
					Add New Item <PlusCircle className="ml-2" />
				</Button>
			</div>
			<div className="rounded-md border w-full">
				<Table className="w-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									{isLoading ? (
										<Illustration type="loading" className="m-auto" />
									) : (
										"No items found."
									)}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}>
					Next
				</Button>
			</div>

			{/* Dialog for Add/Edit Item */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isEditMode ? "Edit Item" : "Add New Item"}</DialogTitle>
					</DialogHeader>

					<AddNewItemForm
						item={formData}
						onSubmit={handleSubmit}
						buttonText={isEditMode ? "Edit Item" : "Add New Item"}
						auctions={auctions}
						isSubmitting={isLoading}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ItemsPage;
