import TopBanner from "@/components/TopBanner";
import AuctionItemList from "@/components/AuctionItemList";

const mockItems = [
	{
		id: "1",
		title: "Smartphone",
		description: "Latest model with advanced features.",
		price: 699,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "2",
		title: "Laptop",
		description: "High-performance laptop for work and gaming.",
		price: 1299,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "3",
		title: "Headphones",
		description: "Noise-cancelling headphones with great sound quality.",
		price: 199,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "4",
		title: "Smartwatch",
		description: "Track your fitness and stay connected on the go.",
		price: 299,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "5",
		title: "Tablet",
		description: "Portable and powerful tablet for work and play.",
		price: 499,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "6",
		title: "Camera",
		description: "Capture stunning photos and videos.",
		price: 899,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "7",
		title: "Gaming Console",
		description: "Next-gen console for immersive gaming.",
		price: 599,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "8",
		title: "Wireless Earbuds",
		description: "Compact and high-quality sound.",
		price: 149,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "9",
		title: "Smart TV",
		description: "4K Ultra HD with streaming capabilities.",
		price: 999,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "10",
		title: "Fitness Tracker",
		description: "Monitor your health and activity levels.",
		price: 99,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Fitness",
	},
	{
		id: "11",
		title: "Bluetooth Speaker",
		description: "Portable speaker with excellent sound quality.",
		price: 129,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "12",
		title: "Drone",
		description: "Capture aerial views with ease.",
		price: 799,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "13",
		title: "Electric Scooter",
		description: "Eco-friendly and fun transportation.",
		price: 499,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Vehicles",
	},
	{
		id: "14",
		title: "Gaming Chair",
		description: "Ergonomic chair for long gaming sessions.",
		price: 199,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Furniture",
	},
	{
		id: "15",
		title: "Mechanical Keyboard",
		description: "Tactile and responsive typing experience.",
		price: 89,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "16",
		title: "Monitor",
		description: "High-resolution display for work and gaming.",
		price: 299,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "17",
		title: "VR Headset",
		description: "Immerse yourself in virtual reality.",
		price: 399,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "18",
		title: "External Hard Drive",
		description: "Expand your storage capacity.",
		price: 79,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "19",
		title: "Smart Home Hub",
		description: "Control your smart devices with ease.",
		price: 149,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Electronics",
	},
	{
		id: "20",
		title: "Electric Kettle",
		description: "Boil water quickly and efficiently.",
		price: 49,
		image: "/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg",
		category: "Home Appliances",
	},
];

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
