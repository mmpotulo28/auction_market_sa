import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

const UserBids = ({ userBids, showBidHistory, setShowBidHistory }) => {
	return (
		<Dialog open={showBidHistory} onOpenChange={setShowBidHistory}>
			<DialogContent>
				<DialogTitle>Your Bid History</DialogTitle>
				{userBids.length === 0 ? (
					<p className="text-muted-foreground">You have not placed any bids yet.</p>
				) : (
					<ul className="divide-y">
						{userBids.map((bid) => (
							<li key={bid.itemId} className="py-2">
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="font-semibold">{bid.item?.title}</span>
									<span className="text-sm text-muted-foreground">
										Bid: R {Number(bid.amount).toFixed(2)}
									</span>
									<span className="text-xs text-muted-foreground">
										{bid.timestamp && new Date(bid.timestamp).toLocaleString()}
									</span>
								</div>
							</li>
						))}
					</ul>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default UserBids;
