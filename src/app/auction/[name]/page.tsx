import AuctionItemList from "@/components/AuctionItemList";
import { fetchAuctionByName } from "@/lib/helpers";
import { iAuction } from "@/lib/types";
import { Suspense } from "react";

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
			</Suspense>
		</div>
	);
};

export default AuctionPage;
