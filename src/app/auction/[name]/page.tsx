"use client";
import { useEffect, useState } from "react";
import CustomerAd from "@/components/ads/CustomerAd";
import AuctionItemList from "@/components/AuctionItemList";
import { fetchAuctionByName } from "@/lib/helpers";
import { iAuction } from "@/lib/types";
import Container from "@/components/common/container";
import React from "react";
import RequestItemModal from "@/components/auction/RequestItemModal";

interface AuctionPageProps {
	params: Promise<{ name: string }>;
}

const AuctionPage = ({ params }: AuctionPageProps) => {
	const [auction, setAuction] = useState<iAuction | undefined>();
	const [loading, setLoading] = useState(true);
	const [showRequestModal, setShowRequestModal] = useState(false);

	// Extract auction name from params
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

	useEffect(() => {
		const timer = setTimeout(() => {
			console.log("Time to request an item!");
			setShowRequestModal(true);
		}, 10000); // 10 second
		return () => clearTimeout(timer);
	}, []);

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
			<RequestItemModal
				open={showRequestModal}
				onOpenChange={setShowRequestModal}
				auctionName={name}
			/>
		</div>
	);
};

export default AuctionPage;
