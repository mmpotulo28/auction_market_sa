import TopBanner from "@/components/TopBanner";
import AuctionItemList from "@/components/AuctionItemList";
import { mockItems } from "@/lib/dummy-data";

export default function Home() {
	return (
		<div>
			<TopBanner />
			<AuctionItemList
				items={mockItems}
				categories={["Electronics", "Fitness", "Vehicles", "Furniture", "Home Appliances"]}
			/>
		</div>
	);
}
