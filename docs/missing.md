Auction Start/End Logic

There is no clear enforcement of auction start/end times (e.g., disabling bidding before/after auction).
No automatic closing of auctions or marking items as sold after auction ends.
User Bid History

Users cannot view their own bid history per item/auction.
No UI for users to see which items they have bid on and their bid amounts.
Auction Winner Notification

No explicit notification or email to the winning bidder when an auction ends.
Order Payment Status Sync

Order status is updated on payment, but there’s no clear handling for failed/cancelled payments (e.g., releasing items back to auction).
Auction Scheduling & Re-Opening

No UI or logic for scheduling future auctions or re-opening closed auctions.
Item Image Upload

Item creation expects an image file, but there’s no upload handler or storage integration (e.g., S3, Supabase Storage).
User Reviews/Feedback

No feature for users to leave reviews or feedback on items, sellers, or the platform.
Admin User Management

No admin UI for managing users (ban, promote, view user activity, etc.).
Email Notifications

No email notifications for important events (winning an auction, payment confirmation, etc.).
Auction Timer/Countdown

Timer is shown, but there’s no enforcement or automatic action when the timer hits zero.
Security & Permissions

No explicit RBAC (role-based access control) for admin vs. user endpoints.
Some admin endpoints may be accessible without proper authentication.
Comprehensive Error Handling

Some error messages are generic; more detailed user feedback and logging would help.
Accessibility

No explicit ARIA roles or accessibility features in custom components.
Testing

No unit or integration tests are present.
Documentation

No README or developer documentation for setup, deployment, or contribution.
