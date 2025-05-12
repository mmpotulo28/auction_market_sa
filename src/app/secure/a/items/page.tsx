"use client";

import React, { useState, useEffect } from "react";
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

import supabase from "@/lib/db";
import { toast } from "sonner";
import styles from "./items.module.css";
import { DeleteIcon, Edit, PlusCircle } from "lucide-react";
import AddNewItemForm from "@/components/dashboard/AddNewItemForm/page";
import { AddItemData } from "@/lib/dbFunctions";

const ItemsPage: React.FC = () => {
	const [items, setItems] = useState<AddItemData[]>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [formData, setFormData] = useState<AddItemData>({
		id: "",
		title: "",
		description: "",
		price: "",
		category: "",
		condition: "new",
		imageFile: null,
		auctionId: "",
	});

	// Fetch items
	useEffect(() => {
		const fetchItems = async () => {
			const { data, error } = await supabase.from("items").select("*");
			if (error) {
				toast.error("Failed to fetch items.");
				return;
			}
			setItems(data || []);
		};
		fetchItems();
	}, []);

	// Define columns for DataTable
	const columns: ColumnDef<AddItemData>[] = [
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
			cell: ({ row }) => (
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => handleEdit(row.original)}>
						<Edit className="mr-2" />
					</Button>
					<Button
						variant="destructive"
						onClick={() => handleDelete(row.original.id || "")}>
						<DeleteIcon className="mr-2" />
					</Button>
				</div>
			),
		},
	];

	// Handle delete item
	const handleDelete = async (id: string) => {
		const { error } = await supabase.from("items").delete().eq("id", id);
		if (error) {
			toast.error("Failed to delete item.");
			return;
		}
		toast.success("Item deleted successfully!");
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	// Handle edit item
	const handleEdit = async (item: AddItemData) => {
		setFormData({
			id: item.id,
			title: item.title,
			description: item.description,
			price: item.price,
			category: item.category,
			condition: item.condition,
			imageFile: item.imageFile || null,
			auctionId: item.auctionId || "",
		});
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

	// Handle form submission
	const handleSubmit = (response: { success: boolean; error: string | undefined }) => {
		if (response.error || response.success) {
			toast.error(response.error);
			return;
		}

		if (isEditMode) {
			setItems((prev) => prev.map((item) => (item.id === formData.id ? formData : item)));
			toast.success("Item updated successfully!");
		} else {
			setItems((prev) => [...prev, formData]);
			toast.success("Item added successfully!");
		}
	};

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
									No items found.
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
						item={{
							id: formData.id,
							title: formData.title,
							description: formData.description,
							price: formData.price,
							category: formData.category,
							condition: formData.condition,
							imageFile: formData.imageFile,
							auctionId: formData.auctionId,
						}}
						onSubmit={handleSubmit}
						buttonText={isEditMode ? "Edit Item" : "Add New Item"}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ItemsPage;
