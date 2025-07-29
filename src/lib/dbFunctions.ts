export interface AddItemData {
	id?: string;
	title: string;
	description: string;
	price: string;
	imageFiles: File[] | null;
	category: string;
	condition: string;
	auctionId: string;
}
