# Auction Market SA - Phase 1 Documentation

## Project Overview

Auction Market SA is a digital auction marketplace for South Africa, combining real-time auction-style purchasing with a modern, scalable web platform. The system supports item listing, real-time bidding, order and transaction management, and seamless payment integration via PayFast.

## Objectives

1. Build a scalable, real-time auction marketplace.
2. Implement robust order, payment, and transaction flows.
3. Provide a secure, feature-rich admin dashboard for management.
4. Ensure type safety, error handling, and clean code throughout.

## Technology Stack

-   **Frontend & Backend:** Next.js (App Router, React, TypeScript)
-   **Database:** Supabase (PostgreSQL)
-   **Authentication:** Clerk.dev
-   **Payments:** PayFast (sandbox and production support)
-   **Real-Time:** WebSockets (for auction updates)
-   **UI:** Tailwind CSS, custom components
-   **Notifications:** Sonner (toast notifications)
-   **Hosting:** Azure

## Features

### User Features

-   **Item Listing:** Users can list items with title, description, price, image, category, and condition.
-   **Auction Participation:** Users can join auctions, place bids, and win items in real-time.
-   **Cart & Checkout:** Won items are added to a cart with a 20-minute checkout window.
-   **PayFast Integration:** Seamless payment initiation and validation with PayFast.
-   **Order Tracking:** Users can track their orders and payment status.
-   **Receipts:** Downloadable and copyable receipts for each transaction.

### Admin Features

-   **Dashboard:** Secure admin dashboard with sidebar navigation.
-   **Items Management:** View, add, edit, and delete items.
-   **Auctions Management:** View, create, edit, and delete auctions.
-   **Orders Management:** View all orders, expand for full details, change order status, copy IDs, and see payment info.
-   **Transactions Management:** View all payment transactions, preview receipts, and search/filter.
-   **Real-Time Updates:** Admins see live updates for items and orders.
-   **Status Badges:** Visual status indicators for orders and transactions.
-   **Search & Filtering:** Powerful search and filter for all admin tables.
-   **Pagination:** Pagination for large data sets.

### APIs

-   **/api/items**: CRUD for items.
-   **/api/items/item?id=**: Fetch item details by ID.
-   **/api/auctions**: CRUD for auctions.
-   **/api/orders/create**: Create orders for cart items.
-   **/api/orders/status**: Update order status (admin and payment flow).
-   **/api/admin/orders**: Fetch all orders (admin).
-   **/api/admin/transactions**: Fetch all transactions (admin).
-   **/api/payfast/initiate**: Initiate PayFast payment (returns HTML form).
-   **/api/payfast/validate**: Validate payment status by m_payment_id or pf_payment_id.
-   **/api/payfast/notify**: PayFast IPN notification endpoint (stores transaction).
-   **/api/items/status**: Update item status (e.g., after cart expiry).

## Architecture

-   **Next.js App Router**: All pages and API routes are colocated.
-   **Supabase**: Used for all database operations, including items, auctions, orders, and transactions.
-   **Clerk.dev**: Handles authentication and user management.
-   **PayFast**: Used for payment processing, with secure server-side validation and notification.
-   **WebSockets**: Used for real-time auction and bid updates.

## Data Models

-   **iAuctionItem**: Represents an item in the auction.
-   **iAuction**: Represents an auction event.
-   **iOrder**: Represents an order for a won item (with status, user, payment, etc.).
-   **iTransaction**: Represents a payment transaction (PayFast).
-   **iOrderStatus**: Enum for all possible order statuses.
-   **User**: Provided by Clerk.dev.

## Order & Payment Flow

1. **Cart Checkout**: User checks out won items.
2. **Order Creation**: Frontend generates `order_id` and `m_payment_id`, creates orders via `/api/orders/create`.
3. **Payment Initiation**: Frontend calls `/api/payfast/initiate` with the same IDs, receives a PayFast HTML form, and submits it.
4. **Payment Validation**: On return, `/api/payfast/validate` checks payment status.
5. **Order Status Update**: If payment is successful, `/api/orders/status` sets order to `PENDING`; if failed, to `FAILED`.
6. **Admin Management**: Admin can view and change order status from the dashboard.

## Type Safety & Error Handling

-   All API endpoints and components use strict TypeScript types from `src/lib/types.ts`.
-   All API endpoints return clear error messages and HTTP status codes.
-   All user actions (add/edit/delete, payment, etc.) provide toast notifications for success/failure.

## UI/UX

-   **Responsive Design:** All pages and tables are responsive.
-   **Admin Sidebar:** Quick navigation between dashboard sections.
-   **Dialogs:** Used for add/edit forms and expanded order views.
-   **Illustrations:** Custom SVGs for loading, success, and error states.
-   **Copy-to-Clipboard:** For order/payment IDs.
-   **Status Badges:** Color-coded for clarity.
-   **Pagination & Filtering:** For all tables.

## Security

-   **Authentication:** All admin routes are protected.
-   **Validation:** All API endpoints validate input and permissions.
-   **PayFast:** All payment flows are server-validated and secure.

## Development Plan

1. **Project Setup:** Next.js, Supabase, Clerk, Tailwind, Sonner.
2. **Core Models & Types:** Define all types in `src/lib/types.ts`.
3. **API Development:** Implement all endpoints with type safety and error handling.
4. **Frontend Pages:** Build user and admin pages with modern UI.
5. **Payment Integration:** Integrate PayFast, handle all payment flows.
6. **Testing:** Manual and automated tests for all flows.
7. **Deployment:** Azure hosting.

## Additional Notes

-   **Order IDs and Payment IDs** are generated on the frontend for traceability.
-   **Order status** is always updated after payment validation.
-   **All admin tables** support search, filtering, and pagination.
-   **All code** is type-safe, robust, and clean.
-   **All endpoints** are documented and follow RESTful conventions.
-   **All error cases** are handled gracefully with user feedback.

---

**If you add new features or flows, update this documentation accordingly.**
