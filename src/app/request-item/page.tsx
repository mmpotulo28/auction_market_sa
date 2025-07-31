import styles from "./request-item.module.css";
import { FaRegImage } from "react-icons/fa";

import { RequestItemForm } from "@/components/RequestItemForm";
import { Suspense } from "react";
import { RequestItemFormProvider } from "@/context/RequestItemContext";

const RequestItemPage: React.FC = () => {
	return (
		<RequestItemFormProvider>
			<div className={styles.pageContainer}>
				<div className={styles.hero}>
					<FaRegImage className={styles.heroIcon} />
					<h1 className={styles.heroTitle}>Request an Item for Auction</h1>
					<p className={styles.heroSubtitle}>
						Can&apos;t find what you want? Suggest an item to be added to an upcoming
						auction!
					</p>
				</div>
				<Suspense fallback={<div>Loading...</div>}>
					<RequestItemForm />
				</Suspense>
			</div>
		</RequestItemFormProvider>
	);
};

export default RequestItemPage;
