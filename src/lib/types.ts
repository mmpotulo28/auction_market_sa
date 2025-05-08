export enum iVariant {
	Primary = "primary",
	Secondary = "secondary",
	Tertiary = "tertiary",
	Quaternary = "quaternary",
	Quinary = "quinary",
}

export type iVariantType = keyof typeof iVariant;

export enum iSize {
	Small = "sm",
	Medium = "md",
	Large = "lg",
}

export type SizeType = keyof typeof iSize;

export interface iLockUpProps {
	id?: string;
	overline?: string;
	title: string;
	subtitle?: string;
	variant?: iVariant;
	size?: iSize;
	theme?: iTheme;
	centered?: boolean;
	bold?: boolean;
}

export enum iTheme {
	Light = "light",
	Dark = "dark",
}

export interface iTransaction {
	m_payment_id?: string;
	pf_payment_id: string;
	payment_status: "COMPLETE" | "CANCELLED";
	item_name: string;
	item_description?: string;
	amount_gross?: number;
	amount_fee?: number;
	amount_net?: number;
	custom_str1?: string;
	custom_str2?: string;
	custom_str3?: string;
	custom_str4?: string;
	custom_str5?: string;
	custom_int1?: number;
	custom_int2?: number;
	custom_int3?: number;
	custom_int4?: number;
	custom_int5?: number;
	name_first?: string;
	name_last?: string;
	email_address?: string;
	merchant_id: string;
	signature?: string;
}

export interface iFooter {
	subscribeTitle: string;
	subscribeDescription: string;
	privacyPolicyLink: string;
	links: { [group: string]: { href: string; label: string }[] };
	copyright: string;
}

export interface iBanner {
	title: string;
	content: string;
	size?: iSize;
	image?: { src: string; alt: string };
	actions?: { label: string; href: string }[];
}

export interface iListItem {
	title: string;
	href: string;
	children: React.ReactNode;
}

export interface iEmailService {
	id: number;
	name: string;
	description: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface iEmail {
	id: number;
	from_email: string;
	to_email: string;
	subject: string;
	body: string;
	status: string;
	date_sent: string;
	sender_id: string;
	service_name: string;
	last_updated: string;
}

export enum iButtonType {
	Link = "link",
	Button = "button",
	Icon = "icon",
	Submit = "submit",
}

export enum iTarget {
	Blank = "_blank",
	Self = "_self",
	Parent = "_parent",
	Top = "_top",
	Empty = "",
}

export interface iButtonProps {
	hide?: boolean;
	variant?: iVariant;
	size?: iSize;
	iconEnd?: React.ReactNode;
	iconStart?: React.ReactNode;
	label?: string;
	className?: string;
	disabled?: boolean;
	centered?: boolean;
	isLoading?: boolean;
	key?: string | number;
	click?: () => void;
	type?: iButtonType;
	url?: {
		link: string;
		target?: iTarget;
	};
}

export type iCondition = "new" | "used";
export interface iAuctionItem {
	id: string;
	title: string;
	description: string;
	price: number;
	image: string;
	category: string;
	condition: iCondition;
	auction: iAuction;
}

export interface iAuction {
	name: string;
	itemsCount: number;
	startTime: Date;
	duration: number;
	reOpenCount: number;
	description?: string;
	dateCreated?: Date;
	createdBy?: string;
}

export interface iBid {
	amount: number;
	userId: string;
	itemId: string;
	timestamp: string;
}

export type iBids = Record<string, iBid[]>;

export interface iSupabasePayload {
	eventType: "INSERT" | "UPDATE" | "DELETE";
	new: iBid;
	old: iBid | null;
}
