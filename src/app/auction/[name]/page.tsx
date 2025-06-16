import AuctionItemList from "@/components/AuctionItemList";
import Container from "@/components/common/container";
import TopBanner from "@/components/TopBanner";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { dateToString } from "@/lib/helpers";
import { iAuction } from "@/lib/types";
import { Suspense } from "react";

const AuctionPage = async ({
	params,
}: {
	params: Promise<{ name: string; auction: iAuction }>;
}) => {
	const { auction } = await params;
	const auctionDate = dateToString(new Date(auction?.start_time || ""));

	return (
		<div>
			<TopBanner
				title={auction?.name || "Auction Market SA"}
				overline={auctionDate}
				subtitle="An auction so good, even your wallet might bid!"
				action={{ label: "View Auction" }}
			/>

			<Container>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/auction">Auction</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{auction?.name || "Auction"}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</Container>

			<Suspense fallback={<div>Loading...</div>}>
				<AuctionItemList itemsPerPage={10} />
			</Suspense>
		</div>
	);
};

export default AuctionPage;
