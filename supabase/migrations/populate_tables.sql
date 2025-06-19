-- Insert mock data into auctions table
INSERT INTO dbo.auctions (name, items_count, start_time, duration, re_open_count, description, date_created, created_by)
VALUES
('Electronics Bonanza', 10, '2025-06-01T10:00:00Z', 120, 2, 'An auction featuring the latest electronics.', '2025-06-15T08:00:00Z', 'admin'),
('Fitness Gear Sale', 5, '2025-11-05T14:00:00Z', 90, 1, 'Get the best deals on fitness equipment.', '2025-08-18T09:30:00Z', 'admin'),
('Home Essentials Auction', 3, '2025-08-10T16:00:00Z', 60, 0, 'Bid on essential home appliances.', '2025-10-20T11:00:00Z', 'admin');

-- Insert mock data into items table
INSERT INTO dbo.items (title, description, price, image, category, condition, auction_id)
VALUES
('Smartphone', 'Latest model with advanced features.', 699, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 1),
('Laptop', 'High-performance laptop for work and gaming.', 1299, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 1),
('Headphones', 'Noise-cancelling headphones with great sound quality.', 199, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 2),
('Smartwatch', 'Track your fitness and stay connected on the go.', 299, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 2),
('Tablet', 'Portable and powerful tablet for work and play.', 499, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 3),
('Camera', 'Capture stunning photos and videos.', 899, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 3),
('Gaming Console', 'Next-gen console for immersive gaming.', 599, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 2),
('Wireless Earbuds', 'Compact and high-quality sound.', 149, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 1),
('Smart TV', '4K Ultra HD with streaming capabilities.', 999, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 1),
('Fitness Tracker', 'Monitor your health and activity levels.', 99, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Fitness', 'new', 2),
('Bluetooth Speaker', 'Portable speaker with excellent sound quality.', 129, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 3),
('Drone', 'Capture aerial views with ease.', 799, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 3),
('Electric Scooter', 'Eco-friendly and fun transportation.', 499, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Vehicles', 'new', 3),
('Gaming Chair', 'Ergonomic chair for long gaming sessions.', 199, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Furniture', 'new', 3),
('Mechanical Keyboard', 'Tactile and responsive typing experience.', 89, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 1),
('Monitor', 'High-resolution display for work and gaming.', 299, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 2),
('VR Headset', 'Immerse yourself in virtual reality.', 399, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 2),
('External Hard Drive', 'Expand your storage capacity.', 79, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 3),
('Smart Home Hub', 'Control your smart devices with ease.', 149, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Electronics', 'new', 3),
('Electric Kettle', 'Boil water quickly and efficiently.', 49, '/images/b145a819-b176-403f-bbc0-bd2e54a264de.jpeg', 'Home Appliances', 'new', 3);
