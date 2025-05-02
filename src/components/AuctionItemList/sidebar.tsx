import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
} from "../ui/sidebar";
import { Slider } from "../ui/slider";
import styles from "./auction-item-list.module.css";

interface AuctionSidebarProps {
	categories: string[];
	selectedCategories: string[];
	toggleCategory: (category: string) => void;
	priceRange: [number, number];
	setPriceRange: (range: [number, number]) => void;
	toggleCondition: (condition: string) => void;
	selectedConditions: Set<string>;
}

const AuctionSidebar: React.FC<AuctionSidebarProps> = ({
	categories,
	selectedCategories,
	toggleCategory,
	priceRange,
	setPriceRange,
	toggleCondition,
	selectedConditions,
}) => {
	return (
		<Sidebar variant="sidebar" className={styles.sidebar}>
			<SidebarHeader />
			<SidebarContent>
				<SidebarGroup className="px-4">
					<SidebarGroupLabel>Filter by Category</SidebarGroupLabel>
					<SidebarGroupContent>
						{categories.map((category) => (
							<div key={category} className={styles.checkbox}>
								<Checkbox
									id={category}
									checked={selectedCategories.includes(category)}
									onCheckedChange={() => toggleCategory(category)}
								/>
								<label htmlFor={category}>{category}</label>
							</div>
						))}
					</SidebarGroupContent>
				</SidebarGroup>

				<Separator />
				<SidebarGroup className="px-4">
					<SidebarGroupLabel>Filter by Price</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className={styles.slider}>
							<Slider
								min={0}
								max={2000}
								value={priceRange}
								onValueChange={(value) => setPriceRange(value as [number, number])}
							/>
							<div className={styles.priceRange}>
								<span>R{priceRange[0]}</span>
								<span>R{priceRange[1]}</span>
							</div>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
				<Separator />
				<SidebarGroup className="px-4">
					<SidebarGroupLabel>Filter by Condition</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className={styles.checkbox}>
							<Checkbox
								id="new"
								onCheckedChange={() => toggleCondition("new")}
								checked={selectedConditions.has("new")}
							/>
							<label htmlFor="new">New</label>
						</div>
						<div className={styles.checkbox}>
							<Checkbox
								id="used"
								onCheckedChange={() => toggleCondition("used")}
								checked={selectedConditions.has("used")}
							/>
							<label htmlFor="used">Used</label>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
};

export default AuctionSidebar;
