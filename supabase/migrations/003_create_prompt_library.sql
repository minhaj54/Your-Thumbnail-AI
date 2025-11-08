-- Create prompt_library table for public prompt sharing
CREATE TABLE public.prompt_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  thumbnail_url TEXT NOT NULL,
  thumbnail_base64 TEXT, -- For base64 encoded images
  extracted_prompt TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source_type TEXT CHECK (source_type IN ('url', 'upload')),
  view_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.prompt_library ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view prompts (public read)
CREATE POLICY "Anyone can view prompts" ON public.prompt_library
  FOR SELECT USING (true);

-- RLS Policy: Authenticated users can add prompts
CREATE POLICY "Authenticated users can add prompts" ON public.prompt_library
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Indexes for better performance
CREATE INDEX idx_prompt_library_created_at ON public.prompt_library(created_at DESC);
CREATE INDEX idx_prompt_library_view_count ON public.prompt_library(view_count DESC);
CREATE INDEX idx_prompt_library_user_id ON public.prompt_library(user_id);

-- Function to update view count (for tracking popularity)
CREATE OR REPLACE FUNCTION public.increment_prompt_view_count(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.prompt_library
  SET view_count = view_count + 1
  WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

