"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import styles from "./requested-items.module.css";

interface RequestedItem {
	id: number;
	auction_name: string;
	item_name: string;
	item_description: string;
	item_images: string[]; // URLs
	condition: string;
	requester_name: string;
	requester_email: string;
	requester_user_id: string;
	created_at: string;
}

const RequestedItemsPage: React.FC = () => {
	const [items, setItems] = useState<RequestedItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState<RequestedItem | null>(null);

	const fetchRequestedItems = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/api/auction-item-requests");
			setItems(res.data.items || []);
		} catch (e: any) {
   toast.error("Failed to fetch requested items.");
   console.error(e);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchRequestedItems();
	}, []);

	return (
		<div className={styles.container}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
			<h1 className={styles.title}>Requested Auction Items</h1>
				<Button size="sm" variant="outline" onClick={fetchRequestedItems}>
					Refresh
				</Button>
			</div>
			{loading ? (
				<div>Loading...</div>
			) : items.length === 0 ? (
				<div>No requested items found.</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Auction</TableHead>
							<TableHead>Item Name</TableHead>
							<TableHead>Condition</TableHead>
							<TableHead>Requester</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.auction_name}</TableCell>
								<TableCell>{item.item_name}</TableCell>
								<TableCell>
									<span className={`${styles.chip} ${item.condition === "new" ? styles.chipNew : styles.chipUsed}`}>
										{item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
									</span>
								</TableCell>
								<TableCell>
									{item.requester_name}
									<br />
									<span className={styles.email}>{item.requester_email}</span>
								</TableCell>
								<TableCell>
									{new Date(item.created_at).toLocaleString()}
								</TableCell>
								<TableCell>
									<Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
										View
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
			<Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
				<DialogContent className={styles.dialogContent}>
					<DialogHeader>
						<DialogTitle>
							Requested Item Details
						</DialogTitle>
					</DialogHeader>
					{selectedItem && (
						<div className={styles.detailsModern}>
							<div className={styles.detailsHeader}>
								<div>
									<div className={styles.detailsTitle}>{selectedItem.item_name}</div>
									<div className={styles.detailsAuction}>{selectedItem.auction_name}</div>
								</div>
								<span className={`${styles.chip} ${selectedItem.condition === "new" ? styles.chipNew : styles.chipUsed}`}>
									{selectedItem.condition.charAt(0).toUpperCase() + selectedItem.condition.slice(1)}
								</span>
							</div>
							<div className={styles.detailsMeta}>
								<div>
									<b>Requested by:</b> {selectedItem.requester_name}
									<br />
									<span className={styles.email}>{selectedItem.requester_email}</span>
									{selectedItem.requester_user_id && (
										<>
											<br />
											<span className={styles.userId}>User ID: {selectedItem.requester_user_id}</span>
										</>
									)}
								</div>
								<div>
									<b>Date:</b> {new Date(selectedItem.created_at).toLocaleString()}
								</div>
							</div>
							<div className={styles.detailsDesc}>
								<b>Description:</b>
								<p>{selectedItem.item_description}</p>
							</div>
							{selectedItem.item_images && selectedItem.item_images.length > 0 && (
								<div className={styles.imagesModern}>
									<b>Images:</b>
									<div className={styles.imageGridModern}>
										{selectedItem.item_images.map((url, idx) => (
											<a href={url} target="_blank" rel="noopener noreferrer" key={idx}>
												<img src={url} alt="Requested Item" className={styles.imageModern} />
											</a>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default RequestedItemsPage;
