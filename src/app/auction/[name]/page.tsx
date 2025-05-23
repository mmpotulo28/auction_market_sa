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
import { mockAuctions } from "@/lib/dummy-data";
import { stringToUrl } from "@/lib/helpers";
import { iAuction } from "@/lib/types";
import { Suspense } from "react";

// Next.js will invalidate the cache when a
// request comes in, at most once every 300 seconds (5 minutes).
export const revalidate = 300;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true;

export async function generateStaticParams() {
	return mockAuctions.map((auction: iAuction) => ({
		name: stringToUrl(auction.name),
	}));
}

const AuctionPage = async ({ params }: { params: { name: string } }) => {
	const { name } = params;
	const auction = mockAuctions.find((auction) => stringToUrl(auction.name) === stringToUrl(name));
	const auctionDate = new Date(auction?.start_time || "").toLocaleString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC",
	});

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
