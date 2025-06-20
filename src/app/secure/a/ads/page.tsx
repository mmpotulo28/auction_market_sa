"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trash2, PlusCircle, RefreshCw } from "lucide-react";
import { AdVariant, AdSlide } from "@/components/ads/CustomerAd";
import { toast } from "sonner";

const variantOptions: AdVariant[] = ["banner", "card-small", "card-big"];

export default function AdminAdsPage() {
	const [ads, setAds] = useState<AdSlide[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState<AdSlide>({
		variant: "card-big",
		title: "",
		description: "",
		imageUrl: "",
		linkUrl: "",
		cta: "",
	});
	const [creating, setCreating] = useState(false);

	const fetchAds = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/ads");
			const data = await res.json();
			if (data.ads) setAds(data.ads);
			else setError(data.error || "No ads found.");
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAds();
	}, []);

	const handleDelete = async (id?: string) => {
		if (!id) return;
		if (!confirm("Delete this ad?")) return;
		const res = await fetch("/api/ads", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		const data = await res.json();
		if (data.success) {
			toast.success("Ad deleted");
			setAds((prev) => prev.filter((ad) => ad.id !== id));
		} else {
			toast.error(data.error || "Failed to delete ad");
		}
	};

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setCreating(true);
		const res = await fetch("/api/ads", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		if (data.success) {
			toast.success("Ad created");
			setForm({
				variant: "card-big",
				title: "",
				description: "",
				imageUrl: "",
				linkUrl: "",
				cta: "",
			});
			fetchAds();
		} else {
			toast.error(data.error || "Failed to create ad");
		}
		setCreating(false);
	};

	return (
		<div className="mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
				<PlusCircle className="w-7 h-7 text-accent" /> Manage Ads
				<Button
					variant="ghost"
					size="icon"
					onClick={fetchAds}
					title="Refresh ads"
					className="ml-2">
					<RefreshCw className={loading ? "animate-spin" : ""} size={18} />
				</Button>
			</h1>
			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Card className="mb-8 p-6">
				<h2 className="text-xl font-semibold mb-2">Create New Ad</h2>
				<form onSubmit={handleCreate} className="flex flex-col gap-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-sm font-medium">Title</label>
							<Input
								placeholder="Ad Title"
								value={form.title}
								onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
								required
							/>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-sm font-medium">CTA</label>
							<Input
								placeholder="Call to Action"
								value={form.cta}
								onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))}
								required
							/>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-sm font-medium">Description</label>
							<Input
								placeholder="Ad Description"
								value={form.description}
								onChange={(e) =>
									setForm((f) => ({ ...f, description: e.target.value }))
								}
								required
							/>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-sm font-medium">Image URL</label>
							<Input
								placeholder="/images/ad-yourimage.jpg"
								value={form.imageUrl}
								onChange={(e) =>
									setForm((f) => ({ ...f, imageUrl: e.target.value }))
								}
								required
							/>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-sm font-medium">Link URL</label>
							<Input
								placeholder="https://your-link.com"
								value={form.linkUrl}
								onChange={(e) =>
									setForm((f) => ({ ...f, linkUrl: e.target.value }))
								}
								required
							/>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-sm font-medium">Variant</label>
							<select
								className="border rounded px-3 py-2"
								value={form.variant}
								onChange={(e) =>
									setForm((f) => ({ ...f, variant: e.target.value as AdVariant }))
								}>
								{variantOptions.map((v) => (
									<option key={v} value={v}>
										{v}
									</option>
								))}
							</select>
						</div>
					</div>
					<Button type="submit" disabled={creating} className="w-fit min-w-[180px]">
						{creating ? "Creating..." : "Create Ad"}
					</Button>
				</form>
			</Card>
			<Card className="p-6">
				<h2 className="text-xl font-semibold mb-4">Current Ads</h2>
				{loading ? (
					<div className="text-center py-8">Loading...</div>
				) : ads.length === 0 ? (
					<div className="text-center py-8">No ads found.</div>
				) : (
					<ul className="divide-y">
						{ads.map((ad) => (
							<li key={ad.id} className="flex items-center gap-4 py-4">
								<img
									src={ad.imageUrl}
									alt={ad.title}
									className="w-24 h-16 object-cover rounded"
								/>
								<div className="flex-1">
									<div className="font-semibold">{ad.title}</div>
									<div className="text-sm text-muted-foreground">
										{ad.description}
									</div>
									<div className="text-xs text-blue-700">{ad.linkUrl}</div>
									<div className="text-xs">Variant: {ad.variant}</div>
								</div>
								<Button
									variant="destructive"
									size="icon"
									onClick={() => handleDelete(ad.id)}>
									<Trash2 className="w-4 h-4" />
								</Button>
							</li>
						))}
					</ul>
				)}
			</Card>
		</div>
	);
}
