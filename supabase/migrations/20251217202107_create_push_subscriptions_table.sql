/*
  # Create Push Subscriptions System

  1. New Tables
    - `push_subscriptions`
      - `id` (uuid, primary key) - Unique identifier for each subscription
      - `user_id` (uuid) - User who owns this subscription
      - `endpoint` (text) - Push service endpoint URL
      - `p256dh_key` (text) - Public key for encryption
      - `auth_key` (text) - Authentication secret
      - `user_agent` (text) - Browser/device information
      - `created_at` (timestamptz) - When subscription was created
      - `last_used` (timestamptz) - Last time notification was sent

  2. Security
    - Enable RLS on push_subscriptions table
    - Users can only manage their own subscriptions
    - Unique constraint on endpoint to prevent duplicates

  3. Important Notes
    - Subscriptions are device/browser specific
    - Users may have multiple active subscriptions (different devices)
    - Expired subscriptions should be cleaned up periodically
*/

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh_key text NOT NULL,
  auth_key text NOT NULL,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON push_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own subscriptions"
  ON push_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own subscriptions"
  ON push_subscriptions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions"
  ON push_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());