-- Notifications table for Auction Market SA
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    message text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    type text DEFAULT 'info',
    admin_only boolean DEFAULT false
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
