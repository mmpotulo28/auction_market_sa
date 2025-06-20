import Link from "next/link";

export default function AccountPage() {
	return (
		<div className="max-w-2xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6">Account</h1>
			<ul className="space-y-4">
				<li>
					<Link href="/account/profile" className="text-blue-600 underline">
						Profile & Settings
					</Link>
				</li>
				<li>
					<Link href="/orders" className="text-blue-600 underline">
						Order History
					</Link>
				</li>
				<li>
					<Link href="/transactions" className="text-blue-600 underline">
						Transactions
					</Link>
				</li>
				<li>
					<Link href="/account/notifications" className="text-blue-600 underline">
						Notifications
					</Link>
				</li>
				{/* Add more user management links as needed */}
			</ul>
		</div>
	);
}
