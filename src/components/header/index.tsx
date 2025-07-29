"use client";
import * as React from "react";
import styles from "./header.module.css";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import {
	FaBars, FaTimes, FaHome, FaUserCircle, FaShoppingCart, FaQuestionCircle,
	FaChevronDown, FaChevronRight, FaCog, FaBell, FaHistory, FaExchangeAlt,
	FaEnvelope, FaFileAlt, FaLock
} from "react-icons/fa";
import { ModeToggle } from "../ToggleTheme";
import Image from "next/image";

const NAV_LINKS = [
	{
		title: "Home",
		href: "/",
		icon: <FaHome />,
	},
	{
		title: "Request Items",
		href: "/request-item",
		icon: <FaExchangeAlt />,
	},
	{
		title: "Account",
		icon: <FaUserCircle />,
		dropdown: [
			{
				title: "Account Home",
				href: "/account",
				desc: "Overview & quick links",
				icon: <FaUserCircle />,
			},
			{
				title: "Profile & Settings",
				href: "/account/profile",
				desc: "Manage your profile and preferences",
				icon: <FaCog />,
			},
			{
				title: "Order History",
				href: "/account/orders",
				desc: "View your orders",
				icon: <FaHistory />,
			},
			{
				title: "Transactions",
				href: "/account/transactions",
				desc: "View your transactions",
				icon: <FaExchangeAlt />,
			},
			{
				title: "Notifications",
				href: "/account/notifications",
				desc: "Your notifications",
				icon: <FaBell />,
			},
		],
	},
	{
		title: "Support",
		icon: <FaQuestionCircle />,
		dropdown: [
			{
				title: "Contact Us",
				href: "/support/contact",
				desc: "Get in touch with our support team.",
				icon: <FaEnvelope />,
			},
			{
				title: "Help Center",
				href: "/support/help-center",
				desc: "Find guides and troubleshooting tips.",
				icon: <FaQuestionCircle />,
			},
			{
				title: "Terms of Service",
				href: "/support/terms",
				desc: "Read our terms of service.",
				icon: <FaFileAlt />,
			},
			{
				title: "Privacy Policy",
				href: "/support/privacy",
				desc: "Read our privacy policy.",
				icon: <FaLock />,
			},
		],
	},
	{
		title: "Cart",
		href: "/cart",
		icon: <FaShoppingCart />,
	},
];

const Header = () => {
	const { user } = useUser();
	const [mobileOpen, setMobileOpen] = React.useState(false);

	return (
		<header className={styles.headerAnimated}>
			<div className={styles.headerInner}>
				<Link href="/" className={styles.logo}>
					<Image className={styles.logoIcon} src="/images/amsa-logo.png" alt="Logo" width={100} height={100} />
				</Link>
				<nav className={styles.nav}>
					<ul className={styles.navList}>
						{NAV_LINKS.map((link) =>
							link.dropdown ? (
								<li
									key={link.title}
									className={`${styles.navItem} ${styles.hasDropdown}`}>
									<button
										className={styles.navLink}
										aria-haspopup="true"
										aria-expanded="false"
										tabIndex={0}>
										<span className={styles.navIcon}>{link.icon}</span>
										{link.title}
										<span className={styles.caret}>
											<FaChevronDown />
										</span>
									</button>
									<div className={styles.dropdownMenu}>
										{link.dropdown.map((item) => (
											<Link
												key={item.title}
												href={item.href}
												className={styles.dropdownItem}>
												<span className={styles.dropdownIcon}>
													{item.icon}
												</span>
												<div>
													<div className={styles.dropdownTitle}>
														{item.title}
													</div>
													<div className={styles.dropdownDesc}>
														{item.desc}
													</div>
												</div>
												<FaChevronRight className={styles.dropdownArrow} />
											</Link>
										))}
									</div>
								</li>
							) : (
								<li key={link.title} className={styles.navItem}>
									<Link href={link.href} className={styles.navLink}>
										<span className={styles.navIcon}>{link.icon}</span>
										{link.title}
									</Link>
								</li>
							),
						)}
					</ul>
				</nav>
				<div className={styles.userSection}>
					<ModeToggle />
					{user ? (
						<UserButton  />
					) : (
						<SignInButton mode="modal">
							<button className={styles.signInBtn}>Sign In</button>
						</SignInButton>
					)}
				</div>
				<button
					className={styles.mobileMenuBtn}
					onClick={() => setMobileOpen((v) => !v)}
					aria-label="Open menu">
					{mobileOpen ? <FaTimes /> : <FaBars />}
				</button>
			</div>
			{/* Mobile menu */}
			{mobileOpen && (
				<nav className={styles.mobileNav}>
					<ul className={styles.mobileNavList}>
						{NAV_LINKS.map((link) =>
							link.dropdown ? (
								<li key={link.title} className={styles.mobileNavItem}>
									{/* For mobile, keep dropdown on click */}
									<details>
										<summary className={styles.mobileNavLink}>
											<span className={styles.navIcon}>{link.icon}</span>
											{link.title}
											<span className={styles.caret}>
												<FaChevronDown />
											</span>
										</summary>
										<div className={styles.mobileDropdownMenu}>
											{link.dropdown.map((item) => (
												<Link
													key={item.title}
													href={item.href}
													className={styles.mobileDropdownItem}
													onClick={() => setMobileOpen(false)}>
													<span className={styles.dropdownIcon}>
														{item.icon}
													</span>
													<div>
														<div className={styles.dropdownTitle}>
															{item.title}
														</div>
														<div className={styles.dropdownDesc}>
															{item.desc}
														</div>
													</div>
													<FaChevronRight
														className={styles.dropdownArrow}
													/>
												</Link>
											))}
										</div>
									</details>
								</li>
							) : (
								<li key={link.title} className={styles.mobileNavItem}>
									<Link
										href={link.href}
										className={styles.mobileNavLink}
										onClick={() => setMobileOpen(false)}>
										<span className={styles.navIcon}>{link.icon}</span>
										{link.title}
									</Link>
								</li>
							),
						)}
						<li className={styles.mobileNavItem}>
							<ModeToggle />
							{user ? (
								<UserButton />
							) : (
								<SignInButton mode="modal">
									<button className={styles.signInBtn}>Sign In</button>
								</SignInButton>
							)}
						</li>
					</ul>
				</nav>
			)}
		</header>
	);
};

export default Header;

