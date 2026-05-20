-- SUPABASE_ROOM_POLICY.sql
-- Apply this in your Supabase SQL editor to allow room creation from anon/public clients.

ALTER TABLE public."Rooms" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on Rooms"
  ON public."Rooms"
  FOR INSERT
  WITH CHECK (auth.role() = 'anon');

CREATE POLICY "Allow public select on Rooms"
  ON public."Rooms"
  FOR SELECT
  USING (true);
