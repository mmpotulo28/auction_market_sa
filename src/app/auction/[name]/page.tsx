"use client";
import { useEffect, useState } from "react";
import CustomerAd from "@/components/ads/CustomerAd";
import AuctionItemList from "@/components/AuctionItemList";
import { fetchAuctionByName } from "@/lib/helpers";
import { iAuction } from "@/lib/types";
import Container from "@/components/common/container";
import React from "react";

interface AuctionPageProps {
	params: Promise<{ name: string }>;
}

const AuctionPage = ({ params }: AuctionPageProps) => {
	const [auction, setAuction] = useState<iAuction | undefined>();
	const [loading, setLoading] = useState(true);
	const { name } = React.use(params);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const auctionData = await fetchAuctionByName(name);
				setAuction(auctionData);
			} catch (error) {
				console.error("Error fetching auction:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [name]);

	return (
		<div>
			{loading ? (
				<div>Loading items...</div>
			) : (
				<>
					<AuctionItemList auction={auction} itemsPerPage={10} />
					<Container>
						<CustomerAd variant="banner" />
					</Container>
				</>
			)}
		</div>
	);
};

export default AuctionPage;
