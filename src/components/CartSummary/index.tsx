import { iCart } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import styles from "./CartSummary.module.css";
import clsx from "clsx";
import { HeartIcon } from "lucide-react";

interface CartSummaryProps {
	cart: iCart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
	const [favorites, setFavorites] = useState<Record<string, boolean>>({});

	const toggleFavorite = (itemId: string) => {
		setFavorites((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
	};

	const calculateItemTotal = (itemId: string, price: number) => {
		return price * 1;
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div>
					<h2 className={styles.headerTitle}>Your Items</h2>
					<p className={styles.headerDesc}>{cart.items_count} items in your cart</p>
				</div>
				<div className={styles.headerSubtotal}>
					<p className={styles.headerSubtotalLabel}>Subtotal</p>
					<p className={styles.headerSubtotalValue}>R{cart.total_amount.toFixed(2)}</p>
				</div>
			</div>

			<div className={styles.items}>
				{cart.items.map((item, index) => {
					const itemQuantity = 1;
					const itemTotal = calculateItemTotal(item.id, item.price);

					return (
						<div key={item.id} className={styles.item}>
							<div className={styles.itemContent}>
								{/* Item Image */}
								<div className={styles.itemImage}>
									<Image
										src={item.image[0]}
										alt={item.title}
										width={80}
										height={80}
										style={{ borderRadius: 12, objectFit: "cover" }}
									/>
									<div className={styles.itemImageOverlay}></div>
								</div>

								{/* Item Details */}
								<div className={styles.itemDetails}>
									<div
										style={{
											display: "flex",
											alignItems: "start",
											justifyContent: "space-between",
										}}>
										<div style={{ flex: 1 }}>
											<h3 className={styles.itemName}>{item.title}</h3>
											{item.description && (
												<p className={styles.itemDesc}>
													{item.description}
												</p>
											)}
										</div>

										{/* Favorite Button */}
										<button
											onClick={() => toggleFavorite(item.id)}
											className={styles.favoriteBtn}
											title={
												favorites[item.id]
													? "Remove from favorites"
													: "Add to favorites"
											}>
											{favorites[item.id] ? (
												<HeartIcon
													style={{
														height: 20,
														width: 20,
														color: "#ef4444",
													}}
												/>
											) : (
												<HeartIcon
													style={{
														height: 20,
														width: 20,
														color: "#94a3b8",
													}}
												/>
											)}
										</button>
									</div>

									<div
										style={{
											marginTop: 16,
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
										}}>
										{/* Price */}
										<div className={styles.itemPrice}>
											<p className={styles.itemPriceValue}>
												R{itemTotal.toFixed(2)}
											</p>
											{itemQuantity > 1 && (
												<p className={styles.itemPriceEach}>
													R{item.price.toFixed(2)} each
												</p>
											)}
										</div>

										{/* Item Status/Tags */}
										<div className={styles.itemTags}>
											<span className={clsx(styles.tag, styles.tagInStock)}>
												✓ In Stock
											</span>
											{index === 0 && (
												<span
													className={clsx(
														styles.tag,
														styles.tagShipping,
													)}>
													🚚 Free Shipping
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Cart Total */}
			<div className={styles.cartTotal}>
				<div>
					<p className={styles.cartTotalLabel}>Subtotal ({cart.items_count} items)</p>
					<p className={styles.cartTotalTags}>🚚 Free shipping included</p>
				</div>
				<div style={{ textAlign: "right" }}>
					<span className={styles.cartTotalValue}>R{cart.total_amount.toFixed(2)}</span>
					<p className={styles.cartTotalVat}>VAT included</p>
				</div>
			</div>
		</div>
	);
}
