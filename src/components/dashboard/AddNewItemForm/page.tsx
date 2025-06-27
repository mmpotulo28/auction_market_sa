"use client";
import React, { useState, useEffect } from "react";
import styles from "./add-items.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaSpinner } from "react-icons/fa";
import Container from "@/components/common/container";
import { AddItemData } from "@/lib/dbFunctions";
import { iAuction } from "@/lib/types";

interface AddNewItemFormProps {
	item: AddItemData;
	onSubmit: ({ e, data }: { e: React.FormEvent; data: AddItemData }) => Promise<void>;
	buttonText: string;
	auctions: iAuction[];
	isSubmitting: boolean;
}

const AddNewItemForm: React.FC<AddNewItemFormProps> = ({
	item,
	buttonText,
	auctions,
	isSubmitting,
	onSubmit,
}) => {
	const [formData, setFormData] = useState<AddItemData>(item);

	useEffect(() => {
		if (item) {
			setFormData(item);
		}
	}, [item]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		console.log("Selected file:", file);
		setFormData((prev) => ({ ...prev, imageFile: file }));
	};

	return (
		<Container padded={false}>
			<div className={styles.container}>
				<form onSubmit={(e) => onSubmit({ e, data: formData })} className={styles.form}>
					<Input
						name="title"
						placeholder="Item Title"
						value={formData.title}
						onChange={handleChange}
						required
					/>
					<Textarea
						name="description"
						placeholder="Item Description"
						value={formData.description}
						onChange={handleChange}
						required
					/>
					<Input
						name="price"
						type="number"
						placeholder="Price"
						value={formData.price}
						onChange={handleChange}
						required
					/>
					<Input
						name="imageFile"
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						required={!item?.imageFile}
					/>
					<Input
						name="category"
						placeholder="Category"
						value={formData.category}
						onChange={handleChange}
						required
					/>
					<select name="auctionId" value={formData.auctionId} onChange={handleChange}>
						<option value="">Select Auction</option>
						{auctions.map((auction) => (
							<option key={auction.id} value={auction.id}>
								{auction.name}
							</option>
						))}
					</select>
					<div className={styles.radioGroup}>
						<label>
							<Input
								type="radio"
								name="condition"
								value="new"
								checked={formData.condition === "new"}
								onChange={handleChange}
								className={styles.radioInput}
							/>
							New
						</label>
						<label>
							<Input
								type="radio"
								name="condition"
								value="used"
								checked={formData.condition === "used"}
								onChange={handleChange}
								className={styles.radioInput}
							/>
							Used
						</label>
					</div>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<FaSpinner className="spin" /> Submitting...
							</>
						) : (
							buttonText
						)}
					</Button>
				</form>
			</div>
		</Container>
	);
};

export default AddNewItemForm;
