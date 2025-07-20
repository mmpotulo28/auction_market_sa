import styles from "./upcoming-auctions.module.css";
import { iAuctionLabel } from "@/lib/types";

const AuctionLabel = ({ type }: { type: iAuctionLabel }) => {
	let label = {
		style: styles.hotLabel,
		text: "🔥 Hot Auction",
	};

	switch (type) {
		case iAuctionLabel.Hot:
			label = { style: styles.hotLabel, text: "🔥 Hot" };
			break;
		case iAuctionLabel.Demo:
			label = { style: styles.demoLabel, text: "Demo" };
			break;
		case iAuctionLabel.Sale:
			label = { style: styles.saleLabel, text: "💰 Flash Sale" };
			break;
		case iAuctionLabel.OpeningSoon:
			label = { style: styles.openingSoonLabel, text: "🚀 Opening Soon" };
			break;
		default:
			label = {
				style: styles.hotLabel,
				text: "🔥 Hot Auction",
			};
	}

	return (
		<div className={`${label.style} ${styles.label}`}>
			<span style={{ color: "#fff", fontWeight: "bold" }}>{label.text} </span>
		</div>
	);
};

export default AuctionLabel;
