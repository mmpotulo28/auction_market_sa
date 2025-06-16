"use client";
import React, { useEffect, useMemo } from "react";
import { useWebSocket } from "@/context/WebSocketProvider";
import { Card } from "@/components/ui/card";
import Container from "@/components/common/container";
import styles from "./dashboard.module.css";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	Legend,
} from "recharts";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";

export default function AdminDashboard() {
	const { items, highestBids, bids, getAllBids } = useWebSocket();

	useEffect(() => {
		getAllBids();
	}, [getAllBids]);

	// Highest bid per item, and highest bidder, and item price
	const bidsPerItem = useMemo(() => {
		const arr = items.map((item) => ({
			name: item.title,
			price: item.price,
			highestBid: highestBids[item.id]?.amount ?? item.price,
			highestBidder: highestBids[item.id]?.userId
				? String(highestBids[item.id].userId).slice(0, 50)
				: "N/A",
		}));
		// Sort by (highestBid - price) descending
		return arr.sort((a, b) => b.highestBid - b.price - (a.highestBid - a.price));
	}, [items, highestBids]);

	// Bid activity per item (trending items)
	const trendingItems = useMemo(() => {
		// If you have all bids in context, use that. Here, we use highestBids timestamps as a proxy.
		const activityMap: Record<string, number> = {};
		bids?.forEach((bid) => {
			activityMap[bid.itemId] = (activityMap[bid.itemId] || 0) + 1;
		});
		return items
			.map((item) => ({
				name: item.title,
				count: activityMap[item.id] || 0,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5); // Top 5 trending
	}, [bids, items]);

	// --- FIX: Bid activity chart should show all recent activity, not just highestBids ---
	// If you have all bids in context, use them. If not, simulate bid events from highestBids changes.
	const bidActivity = React.useMemo(() => {
		// Collect all bid timestamps from highestBids (simulate as best as possible)
		const allTimestamps: Date[] = bids.map((bid) => {
			const d = new Date(bid.timestamp);
			// Add 2 hours to correct for timezone difference
			d.setHours(d.getHours() + 2);
			return d;
		});

		// To avoid caching, always recalculate for the last 30 minutes
		const now = new Date();
		const activity: { time: string; count: number }[] = [];
		for (let i = 29; i >= 0; i--) {
			const t = new Date(now.getTime() - i * 60000);
			const label = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
			activity.push({ time: label, count: 0 });
		}
		allTimestamps.forEach((bidTime) => {
			const label = bidTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
			const found = activity.find((a) => a.time === label);
			if (found) found.count += 1;
		});
		return activity;
	}, [bids]);

	return (
		<Container>
			<div className={styles.dashboardGrid}>
				{/* Highest Bid vs Starting Price per Item - Chart */}
				<Card className={styles.chartCard}>
					<h2 className="text-xl font-semibold mb-4">
						Highest Bid vs Starting Price per Item
					</h2>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={bidsPerItem}>
							<XAxis dataKey="name" tick={{ fontSize: 12 }} />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="price" fill="#b0b0b0" name="Starting Price" />
							<Bar dataKey="highestBid" fill="#8884d8" name="Highest Bid" />
						</BarChart>
					</ResponsiveContainer>
				</Card>
				{/* Highest Bids Table */}
				<Card className={styles.chartCard}>
					<h2 className="text-xl font-semibold mb-4">Highest Bids Table</h2>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Item</TableHead>
								<TableHead>Highest Bidder</TableHead>
								<TableHead>Highest Bid</TableHead>
								<TableHead>Starting Price</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{bidsPerItem.map((item, idx) => (
								<TableRow key={item.name + idx}>
									<TableCell>{item.name}</TableCell>
									<TableCell>
										{item.highestBidder}
										{item.highestBidder.length === 50 ? "..." : ""}
									</TableCell>
									<TableCell>R {item.highestBid}</TableCell>
									<TableCell>R {item.price}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			</div>
			<div className={styles.dashboardGrid}>
				<Card className={styles.chartCard}>
					<h2 className="text-xl font-semibold mb-4">Bid Activity (Last 30 min)</h2>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={bidActivity}>
							<XAxis dataKey="time" minTickGap={20} />
							<YAxis allowDecimals={false} />
							<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
							<Tooltip />
							<Legend />
							<Line type="monotone" dataKey="count" stroke="#82ca9d" name="Bids" />
						</LineChart>
					</ResponsiveContainer>
				</Card>
				<Card className={styles.chartCard}>
					<h2 className="text-xl font-semibold mb-4">Trending Items</h2>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={trendingItems}>
							<XAxis dataKey="name" tick={{ fontSize: 12 }} />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Legend />
							<Bar dataKey="count" fill="#8884d8" name="Bid Activity" />
						</BarChart>
					</ResponsiveContainer>
				</Card>
			</div>
		</Container>
	);
}
