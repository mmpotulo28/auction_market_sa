"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./request-item.module.css";
import { FaRegImage, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import CopyElement from "@/components/CopyElement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface Auction {
	id: string;
	name: string;
	description: string;
	start_time: string;
}

const initialForm = {
	itemName: "",
	itemDescription: "",
	itemImages: [] as File[],
	condition: "new",
	requesterName: "",
	requesterEmail: "",
	requesterUserId: "",
};

const RequestItemPage: React.FC = () => {
	const [auctions, setAuctions] = useState<Auction[]>([]);
	const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
	const [form, setForm] = useState(initialForm);
	const [submitting, setSubmitting] = useState(false);
	const [submitMsg, setSubmitMsg] = useState<string | null>(null);
	const [step, setStep] = useState<1 | 2>(1);
	const { user } = useUser();

	useEffect(() => {
		const fetchAuctions = async () => {
			try {
				const res = await axios.get("/api/auctions");
				setAuctions(res.data || []);
			} catch (e) {
				console.error("Failed to fetch auctions:", e);
				setAuctions([]);
			}
		};
		fetchAuctions();
	}, []);

	useEffect(() => {
		if (user) {
			setForm((prev) => ({
				...prev,
				requesterName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
				requesterEmail: user.primaryEmailAddress?.emailAddress ?? "",
				requesterUserId: user.id ?? "",
			}));
		}
	}, [user]);

	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : [];
		setForm((prev) => ({ ...prev, itemImages: files }));
	};

	const handleAuctionSelect = (auction: Auction) => {
		setSelectedAuction(auction);
		setStep(2);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSubmitMsg(null);
		try {
			const formData = new FormData();
			formData.append("auctionName", selectedAuction?.name || "");
			formData.append("itemName", form.itemName);
			formData.append("itemDescription", form.itemDescription);
			formData.append("condition", form.condition);
			formData.append("requesterName", form.requesterName);
			formData.append("requesterEmail", form.requesterEmail);
			formData.append("requesterUserId", form.requesterUserId);
			form.itemImages.forEach((file) => {
				formData.append("itemImages", file, file.name);
			});
			await axios.post("/api/auction-item-requests", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setSubmitMsg("Request submitted! We'll review your suggestion soon.");
			setForm(initialForm);
			setStep(1);
			setSelectedAuction(null);
		} catch (err: any) {
			console.error("Error submitting request:", err);
			setSubmitMsg("Failed to submit request. Please try again.");
		}
		setSubmitting(false);
	};

	return (
		<div className={styles.pageContainer}>
			<div className={styles.hero}>
				<FaRegImage className={styles.heroIcon} />
				<h1 className={styles.heroTitle}>Request an Item for Auction</h1>
				<p className={styles.heroSubtitle}>
					Can&apos;t find what you want? Suggest an item to be added to an upcoming
					auction!
				</p>
			</div>
			<div className={`${styles.card} ${step === 2 ? styles.slideIn : ""}`}>
				{step === 1 && (
					<>
						<h2 className={styles.cardTitle}>Select an Auction</h2>
						{auctions.length === 0 ? (
							<div className={styles.empty}>No auctions available.</div>
						) : (
							<ul className={styles.auctionList}>
								{auctions.map((auction, idx) => (
									<li
										key={auction.id}
										className={`${styles.auctionItem} ${styles.auctionSlideIn}`}
										style={{ animationDelay: `${idx * 60}ms` }}
										onClick={() => handleAuctionSelect(auction)}>
										<div>
											<span className={styles.auctionName}>
												{auction.name}
											</span>
											<span className={styles.auctionDesc}>
												{auction.description}
											</span>
										</div>
										<span className={styles.auctionDate}>
											{new Date(auction.start_time).toLocaleDateString()}
										</span>
									</li>
								))}
							</ul>
						)}
					</>
				)}
				{step === 2 && (
					<form
						className={`${styles.form} ${styles.formGrid} ${styles.formSlideIn}`}
						onSubmit={handleSubmit}
						autoComplete="off">
						<div className={styles.formHeader}>
							<button
								type="button"
								className={styles.backBtn}
								onClick={() => {
									setStep(1);
									setSelectedAuction(null);
									setSubmitMsg(null);
								}}>
								&larr; Back
							</button>
							<h2 className={styles.cardTitle}>
								Request for{" "}
								<span className={styles.auctionName}>{selectedAuction?.name}</span>
							</h2>
						</div>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Item Name</label>
							<Input
								name="itemName"
								value={form.itemName}
								onChange={handleFormChange}
								required
							/>
						</div>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Condition</label>
							<Select
								value={form.condition}
								onValueChange={(value) =>
									setForm((prev) => ({ ...prev, condition: value }))
								}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select a fruit" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Select condition</SelectLabel>
										<SelectItem value="new">New</SelectItem>
										<SelectItem value="used">Used</SelectItem>
										<SelectItem value="refurbished">Refurbished</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Item Images (optional)</label>
							<Input
								name="itemImages"
								type="file"
								multiple
								accept="image/*"
								onChange={handleFileChange}
							/>
							{form.itemImages.length > 0 && (
								<div className={styles.fileList}>
									{form.itemImages.map((file, idx) => (
										<span key={idx} className={styles.fileBadge}>
											<CopyElement content={file.name} />
										</span>
									))}
								</div>
							)}
						</div>
						<div className={styles.fieldGroup}>
							<label hidden={!!user} className={styles.label}>
								Your Name
							</label>
							<Input
								name="requesterName"
								value={form.requesterName}
								onChange={handleFormChange}
								required
								disabled={!!user}
								hidden={!!user}
							/>
						</div>
						<div className={styles.fieldGroup}>
							<label hidden={!!user} className={styles.label}>
								Your Email
							</label>
							<Input
								name="requesterEmail"
								type="email"
								value={form.requesterEmail}
								onChange={handleFormChange}
								required
								disabled={!!user}
								hidden={!!user}
							/>
						</div>
						<div className={styles.fieldGroup}>
							<label hidden={!!user} className={styles.label}>
								Your User ID (optional)
							</label>
							<Input
								aria-label="Your User ID"
								name="requesterUserId"
								value={form.requesterUserId}
								onChange={handleFormChange}
								disabled={!!user}
								hidden={!!user}
							/>
						</div>

						<div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
							<label className={styles.label}>Item Description</label>
							<Textarea
								name="itemDescription"
								value={form.itemDescription}
								onChange={handleFormChange}
								required
							/>
						</div>
						{!user && (
							<span className={styles.infoText}>
								<Info className={styles.infoIcon} />
								It is recommended to sign in before submitting a request, so that we
								can alert you when we have your requested item.
							</span>
						)}
						<Button type="submit" disabled={submitting}>
							{submitting ? "Submitting..." : "Submit Request"}
						</Button>
						{submitMsg && (
							<div
								className={`${styles.submitMsg} ${
									submitMsg.startsWith("Request submitted")
										? styles.successMsg
										: styles.errorMsg
								}`}>
								{submitMsg.startsWith("Request submitted") ? (
									<FaCheckCircle />
								) : (
									<FaExclamationCircle />
								)}
								<span>{submitMsg}</span>
							</div>
						)}
					</form>
				)}
			</div>
		</div>
	);
};

export default RequestItemPage;
