import AuctionItemList from "@/components/AuctionItemList";
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
		</div>
	);
};

export default Auction;
