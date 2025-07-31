import React from "react";
import styles from "./about.module.css";
import { FaGavel, FaUsers, FaLock, FaRocket, FaRegClock, FaMobileAlt } from "react-icons/fa";
import Image from "next/image";
import Illustration from "@/components/Illustration";
import Container from "@/components/common/container";

const AboutPage = () => (
	<div className={styles.pageContainer}>
		<Container>
			<div className={styles.hero}>
				<Image
					src="/images/amsa-logo.png"
					alt="Auction Market SA Logo"
					width={110}
					height={110}
					className={styles.logo}
				/>
				<h1 className={styles.title}>About Auction Market SA</h1>
				<p className={styles.subtitle}>
					Empowering South Africa with real-time, secure, and modern online auctions.
				</p>
			</div>
			<div className={styles.content}>
				<section className={`${styles.section} ${styles.span2}`}>
					<span className={styles.illustration}>
						<Illustration type="auction" />
					</span>
					<h2>
						<FaGavel className={styles.icon} /> What is Auction Market SA?
					</h2>
					<p>
						<b>Auction Market SA</b> is South Africa’s most innovative digital auction
						platform, built to connect buyers and sellers in a seamless, transparent,
						and secure environment. We are proudly South African, focused on empowering
						local communities, businesses, and individuals to participate in the digital
						economy through real-time auctions.
					</p>
					<p>
						Our platform is designed for everyone: from first-time bidders to
						experienced auctioneers, from small businesses to large enterprises. We
						offer a wide range of auction categories, including electronics, vehicles,
						collectibles, property, and more. With our advanced technology, you can bid,
						win, and pay securely from anywhere in South Africa.
					</p>
					<p>
						We believe in <b>fairness</b>, <b>accessibility</b>, and <b>community</b>.
						Our mission is to make auctions easy, fun, and rewarding for all South
						Africans, while supporting local sellers and promoting economic growth.
					</p>
					<p>
						Whether you’re looking for a bargain, a rare collectible, or a new way to
						sell your goods, Auction Market SA is your trusted partner in the world of
						online auctions.
					</p>
				</section>
				<section className={styles.section}>
					<span className={styles.illustration}>
						<Illustration type="why" />
					</span>
					<h2>
						<FaRocket className={styles.icon} /> Why Choose Us?
					</h2>
					<ul className={styles.features}>
						<li>
							<FaRegClock className={styles.featureIcon} />
							<span>
								<b>Real-Time Auctions:</b> Experience live bidding with instant
								updates and fair competition.
							</span>
						</li>
						<li>
							<FaLock className={styles.featureIcon} />
							<span>
								<b>Secure & Trusted:</b> Your data and payments are protected with
								industry-leading security and PayFast integration.
							</span>
						</li>
						<li>
							<FaUsers className={styles.featureIcon} />
							<span>
								<b>Community Driven:</b> Suggest items, leave feedback, and help
								shape the future of online auctions in SA.
							</span>
						</li>
						<li>
							<FaMobileAlt className={styles.featureIcon} />
							<span>
								<b>Mobile Ready:</b> Bid and win from anywhere with our responsive
								web app and mobile downloads.
							</span>
						</li>
					</ul>
				</section>
				<section className={`${styles.section} ${styles.spanRow2}`}>
					<span className={styles.illustration}>
						<Illustration type="mission" />
					</span>
					<h2>
						<FaGavel className={styles.icon} /> Our Mission
					</h2>
					<p>
						Our mission is to make auctions accessible, transparent, and enjoyable for
						everyone in South Africa. We believe in fair play, innovation, and
						empowering our users—whether you&apos;re a first-time bidder or a seasoned
						seller.
					</p>
				</section>
				<section className={styles.section}>
					<span className={styles.illustration}>
						<Illustration type="team" />
					</span>
					<h2>
						<FaUsers className={styles.icon} /> Meet the Team
					</h2>
					<p>
						Auction Market SA is built by passionate South African technologists,
						designers, and auctioneers. We are committed to delivering a world-class
						experience and supporting our community every step of the way.
					</p>
				</section>
				<section className={styles.section}>
					<span className={styles.illustration}>
						<Illustration type="security" />
					</span>
					<h2>
						<FaLock className={styles.icon} /> Technology & Security
					</h2>
					<p>
						Our platform is built with Next.js, Supabase, Clerk.dev, and PayFast for
						secure authentication and payments. We use real-time WebSockets for live
						bidding and robust error handling for a seamless experience.
					</p>
				</section>
				<section className={styles.section}>
					<span className={styles.illustration}>
						<Illustration type="join" />
					</span>
					<h2>
						<FaGavel className={styles.icon} /> Join the Auction!
					</h2>
					<p>
						Ready to start bidding or selling?{" "}
						<a href="/auth?type=signup" className={styles.link}>
							Create your account
						</a>{" "}
						and join the action today! Need help? Visit our{" "}
						<a href="/support/help-center" className={styles.link}>
							Help Center
						</a>{" "}
						or{" "}
						<a href="/support/contact" className={styles.link}>
							Contact Support
						</a>
						.
					</p>
				</section>
			</div>
		</Container>
	</div>
);

export default AboutPage;
