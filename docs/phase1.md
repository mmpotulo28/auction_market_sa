# Action Market SA - Phase 1 Plan

## Project Overview

Action Market SA combines Facebook Marketplace-like functionality with an auction-style purchasing system. The platform will allow users to list items for sale and purchase them in a first-come, first-served (FCFS) auction format. Future upgrades will include bidding for already purchased items.

## Objectives

1. Build a scalable and real-time marketplace platform.
2. Implement auction-style purchasing using WebSockets for real-time updates.
3. Develop APIs for item management, user authentication, and transaction processing.
4. Create a user-friendly interface for buyers and sellers.

## Proposed Technology Stack

-   **Frontend and Backend**:
    -   Next.js for both the auction website and backend APIs.
-   **Hosting**:
    -   Azure for cloud hosting and scalability.
-   **Version Control**:
    -   GitHub for codebase management.

## Features (Phase 1)

### User Features

-   **Item Listing**: Users can list items with details such as title, description, price, and images.
-   **Real-Time Updates**: Buyers and sellers receive real-time updates on item availability using WebSockets.
-   **Auction Purchase**: Items are purchased on a first-come, first-served basis.

### Admin Features

-   **Dashboard**: Admins can manage users, items, and transactions through a secure admin interface.

### APIs

-   **User Management**: APIs for user registration, login, and profile management.
-   **Item Management**: APIs for creating, updating, and deleting items.
-   **Transaction Processing**: APIs for handling purchases and payments.

## Architecture

### Frontend and Backend

-   **Next.js**: Used for both frontend and backend, leveraging its API routes for server-side functionality and React components for the user interface.

### Real-Time Communication

-   **WebSockets**: For real-time updates on item availability and auction status.

### Hosting

-   **Azure**: For hosting the Next.js application and WebSocket server.

## Technical Planning

### Pages

1. **Home Page (`/`)**:
    - Displays featured items and categories.
    - Search bar for finding items.
2. **Item Details Page (`/item/[id]`)**:
    - Shows detailed information about a specific item.
    - Includes a "Buy Now" button for auction-style purchasing.
3. **User Profile Page (`/profile`)**:
    - Displays user information and their listed items.
4. **Admin Dashboard (`/admin`)**:
    - Restricted to admin users for managing items, users, and transactions.
5. **Authentication Pages (`/login`, `/register`)**:
    - Login and registration forms for users.

### Components

1. **Header**:
    - Navigation bar with links to home, profile, and admin dashboard.
2. **Footer**:
    - Contains links to terms, privacy policy, and contact information.
3. **ItemCard**:
    - Displays a summary of an item (image, title, price).
4. **ItemList**:
    - Grid or list view of multiple `ItemCard` components.
5. **RealTimeUpdates**:
    - Handles WebSocket connections for live updates.
6. **Form Components**:
    - Reusable components for forms (e.g., `InputField`, `Button`).

### APIs

1. **GET `/api/items`**:
    - Fetch a list of items.
2. **GET `/api/items/[id]`**:
    - Fetch details of a specific item.
3. **POST `/api/items`**:
    - Create a new item (restricted to authenticated users).
4. **PUT `/api/items/[id]`**:
    - Update an existing item (restricted to the item's owner).
5. **DELETE `/api/items/[id]`**:
    - Delete an item (restricted to the item's owner).
6. **POST `/api/auth/login`**:
    - Authenticate a user.
7. **POST `/api/auth/register`**:
    - Register a new user.
8. **POST `/api/transactions`**:
    - Handle item purchases.

## Development Plan

1. **Week 1-2**: Set up the Next.js project structure and repositories on GitHub.
2. **Week 3-4**: Develop the frontend pages and reusable components.
3. **Week 5-6**: Implement backend APIs using Next.js API routes.
4. **Week 7-8**: Integrate WebSocket server for real-time updates.
5. **Week 9-10**: Test and deploy the platform on Azure.

## Future Upgrades

-   **Bidding System**: Allow users to bid on already purchased items.
-   **Advanced Search**: Implement filters and search functionality for better item discovery.
-   **Mobile App**: Develop a mobile app for iOS and Android.

## Conclusion

Phase 1 focuses on building the core functionality of Action Market SA using Next.js for both frontend and backend, ensuring a seamless user experience and a scalable architecture. Future phases will expand the platform's capabilities based on user feedback and market needs.
