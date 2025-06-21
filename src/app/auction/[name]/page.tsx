import CustomerAd from "@/components/ads/CustomerAd";
import AuctionItemList from "@/components/AuctionItemList";
import { fetchAuctionByName } from "@/lib/helpers";
import { iAuction } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import Container from "@/components/common/container";

const AuctionPage = async ({
	params,
}: {
	params: Promise<{ name: string; auction: iAuction }>;
}) => {
	const { name } = await params;

	// fetch the auction data using the name
	const auction = await fetchAuctionByName(name);
	console.log(auction);

	return (
		<div>
			<Suspense fallback={<div>Loading items...</div>}>
				<AuctionItemList auction={auction} itemsPerPage={10} />

				<Container>
					<Separator className="my-3" />
					<CustomerAd variant="banner" />
					<Separator className="my-3" />
				</Container>
			</Suspense>
		</div>
	);
};

export default AuctionPage;
