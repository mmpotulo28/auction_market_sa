import Link from "next/link";
import styles from "./404.module.css";

export default function NotFound() {
	return (
		<div className={styles.container}>
			<div className={styles.illustration}>
				<svg width="180" height="180" viewBox="0 0 180 180" fill="none">
					<circle
						cx="90"
						cy="90"
						r="80"
						fill="var(--color-card)"
						stroke="var(--color-accent)"
						strokeWidth="4"
					/>
					<ellipse
						cx="90"
						cy="120"
						rx="45"
						ry="18"
						fill="var(--color-muted)"
						opacity="0.3"
					/>
					<circle cx="65" cy="80" r="8" fill="var(--color-accent)" />
					<circle cx="115" cy="80" r="8" fill="var(--color-accent)" />
					<rect
						x="70"
						y="110"
						width="40"
						height="8"
						rx="4"
						fill="var(--color-accent)"
						opacity="0.5"
					/>
					<path
						d="M70 110 Q90 125 110 110"
						stroke="var(--color-accent)"
						strokeWidth="3"
						fill="none"
					/>
				</svg>
			</div>
			<h1 className={styles.title}>404 - Page Not Found</h1>
			<p className={styles.subtitle}>
				Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
			</p>
			<Link href="/" className={styles.homeLink}>
				Go back home
			</Link>
		</div>
	);
}
