"use client";
import React from "react";
import styles from "./app-download.module.css";
import { FaApple, FaAndroid, FaMobileAlt } from "react-icons/fa";
import Image from "next/image";

const iosUrl = "https://auctionmarket.tech/app-download/ios"; // Replace with your iOS App Store link
const androidUrl = "https://auctionmarket.tech/app-download/android"; // Replace with your Play Store link

const AppDownloadPage: React.FC = () => {
	return (
		<div className={styles.pageContainer}>
			<div className={styles.hero}>
				<FaMobileAlt className={styles.heroIcon} />
				<h1 className={styles.heroTitle}>Get the Auction Market SA App</h1>
				<p className={styles.heroSubtitle}>
					Experience the best of Auction Market SA on your mobile device.<br />
					Choose your platform to download the app and join the bidding action anywhere, anytime!
				</p>
			</div>
			<div className={styles.card}>
				<div className={styles.downloadOptions}>
					<a href={iosUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn + " " + styles.iosBtn}>
						<FaApple className={styles.downloadIcon} />
						<span>
							Download for <b>iOS</b>
							<br />
							<span className={styles.storeText}>App Store</span>
						</span>
					</a>
					<a href={androidUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn + " " + styles.androidBtn}>
						<FaAndroid className={styles.downloadIcon} />
						<span>
							Download for <b>Android</b>
							<br />
							<span className={styles.storeText}>Google Play</span>
						</span>
					</a>
				</div>
				<div className={styles.qrSection}>
					<p className={styles.qrText}>Scan to download:</p>
					<div className={styles.qrCodes}>
						<div className={styles.qrBlock}>
							{/* Replace with your QR code image for iOS */}
							<Image src="/images/qr-ios.png" alt="iOS QR" className={styles.qrImg} width={90} height={90} />
							<span className={styles.qrLabel}>iOS</span>
						</div>
						<div className={styles.qrBlock}>
							{/* Replace with your QR code image for Android */}
							<Image src="/images/qr-android.png" alt="Android QR" className={styles.qrImg} width={90} height={90} />
							<span className={styles.qrLabel}>Android</span>
						</div>
					</div>
				</div>
				<div className={styles.info}>
					<p>
						Need help? <a href="/support/contact" className={styles.link}>Contact support</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default AppDownloadPage;
