import { SparklesIcon, ShieldCheckIcon, User2Icon, ClockIcon } from "lucide-react";

const featuresData = [
	{
		icon: SparklesIcon,
		title: "Real-Time Auctions",
		description: "Bid and watch auctions update instantly, no refresh needed.",
	},
	{
		icon: User2Icon,
		title: "User Profiles",
		description: "Manage your listings, bids, and purchases in one place.",
	},
	{
		icon: ShieldCheckIcon,
		title: "Secure Transactions",
		description: "Your payments and data are protected with industry standards.",
	},
	{
		icon: ClockIcon,
		title: "24/7 Support",
		description: "Get help anytime from our dedicated support team.",
	},
];

const Features = () => (
	<section id="features" className="my-16">
		<h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			{featuresData.map((feature, index) => (
				<div
					key={index}
					className="flex flex-col items-center text-center p-6 rounded-xl bg-foreground shadow">
					<feature.icon size={40} className="mb-4 text-accent" />
					<h3 className="font-semibold text-lg mb-2 text-background">{feature.title}</h3>
					<p className="text-muted">{feature.description}</p>
				</div>
			))}
		</div>
	</section>
);

export default Features;
