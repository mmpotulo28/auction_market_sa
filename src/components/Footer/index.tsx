"use client";

import * as React from "react";
import Link from "next/link";
import styles from "./footer.module.css";
import ShareApp from "./ShareApp";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.grid}>
					<div>
						<h4 className={styles.heading}>About Us</h4>
						<p className={styles.text}>
							Action Market SA is a real-time auction marketplace for buying and
							selling items.
						</p>
						<ShareApp />
					</div>
					<div>
						<h4 className={styles.heading}>Quick Links</h4>
						<ul className={styles.list}>
							<li>
								<Link href="/" className={styles.link}>
									Home
								</Link>
							</li>
							<li>
								<Link href="/about" className={styles.link}>
									About Us
								</Link>
							</li>
							<li>
								<Link href="/support/help-center" className={styles.link}>
									Help Center
								</Link>
							</li>
							<li>
								<Link href="/support/privacy" className={styles.link}>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/support/terms" className={styles.link}>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/app-download" className={styles.link}>
									App Downloads
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className={styles.heading}>Contact</h4>
						<ul className={styles.list}>
							<li>Email: support@auctionmarket.tech</li>
							<li>Phone: +27 79 653 0453</li>
							<li>
								<Link href="/support/contact" className={styles.link}>
									Contact Us
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className={styles.copy}>
					&copy; {new Date().getFullYear()} Action Market SA. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
