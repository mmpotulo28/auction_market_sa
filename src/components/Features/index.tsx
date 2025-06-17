import { SparklesIcon, ShieldCheckIcon, User2Icon, ClockIcon } from "lucide-react";

const Features = () => (
	<section id="features" className="my-16">
		<h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			<div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow">
				<SparklesIcon size={40} className="mb-4 text-accent" />
				<h3 className="font-semibold text-lg mb-2">Real-Time Auctions</h3>
				<p className="text-muted-foreground">
					Bid and watch auctions update instantly, no refresh needed.
				</p>
			</div>
			<div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow">
				<User2Icon size={40} className="mb-4 text-accent" />
				<h3 className="font-semibold text-lg mb-2">User Profiles</h3>
				<p className="text-muted-foreground">
					Manage your listings, bids, and purchases in one place.
				</p>
			</div>
			<div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow">
				<ShieldCheckIcon size={40} className="mb-4 text-accent" />
				<h3 className="font-semibold text-lg mb-2">Secure Transactions</h3>
				<p className="text-muted-foreground">
					Your payments and data are protected with industry standards.
				</p>
			</div>
			<div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow">
				<ClockIcon size={40} className="mb-4 text-accent" />
				<h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
				<p className="text-muted-foreground">
					Get help anytime from our dedicated support team.
				</p>
			</div>
		</div>
	</section>
);

export default Features;
