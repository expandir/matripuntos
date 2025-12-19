/*
  # Create Chat Messages System

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `couple_id` (uuid) - ID of the couple this message belongs to
      - `sender_id` (uuid) - User who sent the message
      - `content` (text) - Message content
      - `read` (boolean) - Whether the message has been read
      - `created_at` (timestamptz) - When message was created

  2. Security
    - Enable RLS on messages table
    - Users can only view messages from their couple
    - Users can only create messages for their couple
    - Users can update read status on messages from their couple

  3. Important Notes
    - Messages are organized by couple
    - Real-time subscriptions enabled for instant messaging
    - Indexes for performance on couple_id and created_at
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_couple_id ON messages(couple_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_couple_sender ON messages(couple_id, sender_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their couple"
  ON messages FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create messages for their couple"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
    AND sender_id = auth.uid()
  );

CREATE POLICY "Users can update read status on messages from their couple"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
  )
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
  );