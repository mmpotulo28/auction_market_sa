import AuctionItemList from "@/components/AuctionItemList";
import Banner from "@/components/Banner";
import Container from "@/components/common/container";
import TopBanner from "@/components/TopBanner";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { mockItems } from "@/lib/dummy-data";
import { Star } from "lucide-react";
import { Suspense } from "react";

const Auction = () => {
	return (
		<div>
			<TopBanner
				items={mockItems}
				overline="Welcome"
				title={"Auction Market SA"}
				subtitle="South Africa's Digital Marketplace Auction"
			/>

			<Container fullWidth>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/auction">Auction</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</Container>

			<Suspense fallback={<div>Loading...</div>}>
				<AuctionItemList items={mockItems} itemsPerPage={10} />
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
