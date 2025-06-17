import AuctionItemList from "@/components/AuctionItemList";
import Banner from "@/components/Banner";
import { Star } from "lucide-react";
import { Suspense } from "react";

const Auction = () => {
	return (
		<div>
			<Suspense fallback={<div>Loading...</div>}>
				<AuctionItemList itemsPerPage={10} />
			</Suspense>

			<Banner
				title={"Found what you were looking for?"}
				content={"Let us know of your experience, it won't take a sec!"}
				image={{
					src: "99199787-6853-443f-bc1d-504959df2a17.jpeg",
					alt: "Auction Image",
				}}
				actions={[
					{
						label: "Leave a review",
						iconStart: <Star className="h-4 w-4" />,
					},
				]}
			/>
		</div>
	);
};

export default Auction;
