-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  is_blocked BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. HOW TO SET AN ADMIN:
-- Run this in your Supabase SQL Editor for your specific user ID:
-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}' WHERE id = 'YOUR-USER-ID';

-- 7. Portfolio Projects Table
CREATE TABLE portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech TEXT[] DEFAULT '{}',
  demo_url TEXT,
  source_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. Tracker Projects Table
CREATE TABLE tracker_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('ACTIVE', 'COMPLETED', 'RESEARCHING')) DEFAULT 'ACTIVE',
  progress INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 9. Timeline Events Table
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT NOT NULL, -- Format: 'MMM YYYY'
  title TEXT NOT NULL,
  description TEXT,
  icon_type TEXT DEFAULT 'clock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 10. Timeline Likes Table
CREATE TABLE timeline_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES timeline_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id)
);

-- 11. Timeline Comments Table
CREATE TABLE timeline_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES timeline_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 12. Contact Messages Table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 13. Security: Row Level Security (RLS)
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 14. Helper Function: Is Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Policies: portfolio_projects
CREATE POLICY "Public Read: portfolio_projects" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Admin All: portfolio_projects" ON portfolio_projects FOR ALL USING (is_admin());

-- 16. Policies: tracker_projects
CREATE POLICY "Public Read: tracker_projects" ON tracker_projects FOR SELECT USING (true);
CREATE POLICY "Admin All: tracker_projects" ON tracker_projects FOR ALL USING (is_admin());

-- 17. Policies: timeline_events
CREATE POLICY "Public Read: timeline_events" ON timeline_events FOR SELECT USING (true);
CREATE POLICY "Admin All: timeline_events" ON timeline_events FOR ALL USING (is_admin());

-- 18. Policies: timeline_likes
CREATE POLICY "Public Read: timeline_likes" ON timeline_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert: timeline_likes" ON timeline_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User Delete: timeline_likes" ON timeline_likes FOR DELETE USING (auth.uid() = user_id);

-- 19. Policies: timeline_comments
CREATE POLICY "Public Read: timeline_comments" ON timeline_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert: timeline_comments" ON timeline_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User Update/Delete: timeline_comments" ON timeline_comments FOR ALL USING (auth.uid() = user_id);

-- 20. Policies: contact_messages
CREATE POLICY "Public Insert: contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read: contact_messages" ON contact_messages FOR SELECT USING (is_admin());

-- 21. About Me Content Table
CREATE TABLE about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio_text TEXT,
  hero_image_url TEXT,
  social_links JSONB DEFAULT '[]', -- [{name, href, icon_type}]
  journey_text TEXT,
  experience_json JSONB DEFAULT '[]', -- [{title, period, description}]
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Initialize with a default row
-- Note: Use a fixed UUID or check existence to prevent duplicates
INSERT INTO about_content (id, bio_text, journey_text) 
VALUES ('00000000-0000-0000-0000-000000000001', 'My path into technology...', 'My journey started...')
ON CONFLICT (id) DO NOTHING;

-- 22. Storage Setup (Run these manually if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true) ON CONFLICT (id) DO NOTHING;
-- CREATE POLICY "Public Read: hero-images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
-- CREATE POLICY "Admin All: hero-images" ON storage.objects FOR ALL USING (bucket_id = 'hero-images' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- RLS
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read: about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Admin All: about_content" ON about_content FOR ALL USING (is_admin());
