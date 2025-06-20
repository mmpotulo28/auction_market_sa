import Container from "@/components/common/container";
import { UserProfile } from "@clerk/nextjs";

export default function ProfileSettingsPage() {
	return (
		<Container>
			<div className="mx-auto py-10 px-4 m-auto">
				<UserProfile />
			</div>
		</Container>
	);
}
