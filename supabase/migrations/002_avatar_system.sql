-- Avatar System Migration
-- Adds avatar config, lawcoins, items shop, and inventory tables

-- 1. Add lawcoins and avatar_config to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS lawcoins INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avatar_config JSONB DEFAULT '{"base":"base_default","hair":null,"facial":null,"clothing_top":null,"clothing_bottom":null,"accessory":null,"background":null,"pet":null,"emote":null}'::jsonb;

-- 2. Items shop table
CREATE TABLE IF NOT EXISTS public.items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('base','hair','facial','clothing_top','clothing_bottom','accessory','background','pet','emote')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common','rare','epic','legendary','mythic')),
  price_gems INTEGER NOT NULL DEFAULT 0,
  price_lawcoins INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. User inventory junction table
CREATE TABLE IF NOT EXISTS public.user_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- 4. RLS Policies

-- Items table: public read
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Items are publicly readable"
  ON public.items FOR SELECT
  USING (true);

-- user_items: users can only read their own inventory
ALTER TABLE public.user_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own inventory"
  ON public.user_items FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory"
  ON public.user_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update user_profiles policy to allow updating avatar_config and lawcoins
-- (The existing policy already allows users to update their own row, so this should be
--  covered by: USING (auth.uid() = id) WITH CHECK (auth.uid() = id))

-- 5. Seed starter items
INSERT INTO public.items (id, type, rarity, price_gems, price_lawcoins, name, image_url) VALUES
  -- Base bodies
  ('base_default', 'base', 'common', 0, 0, 'Law Student', '/avatars/base_default.svg'),
  ('base_barrister', 'base', 'rare', 200, 0, 'Barrister', '/avatars/base_barrister.svg'),
  ('base_judge', 'base', 'epic', 500, 0, 'The Judge', '/avatars/base_judge.svg'),
  ('base_law_lord', 'base', 'legendary', 0, 200, 'Law Lord', '/avatars/base_law_lord.svg'),

  -- Hair
  ('hair_barrister_wig', 'hair', 'rare', 150, 0, 'Barrister Wig', '/avatars/hair_barrister_wig.svg'),
  ('hair_judge_full', 'hair', 'epic', 300, 0, 'Full-Bottomed Wig', '/avatars/hair_judge_full.svg'),
  ('hair_sleek', 'hair', 'common', 50, 0, 'Sleek Cut', '/avatars/hair_sleek.svg'),
  ('hair_crown', 'hair', 'mythic', 0, 0, 'Crown of Justice', '/avatars/hair_crown.svg'),

  -- Facial
  ('facial_monocle', 'facial', 'rare', 100, 0, 'Monocle of Scrutiny', '/avatars/facial_monocle.svg'),
  ('facial_spectacles', 'facial', 'common', 30, 0, 'Reading Spectacles', '/avatars/facial_spectacles.svg'),
  ('facial_blindfold', 'facial', 'legendary', 0, 150, 'Lady Justice Blindfold', '/avatars/facial_blindfold.svg'),

  -- Clothing top
  ('clothing_silk_qc_robe', 'clothing_top', 'epic', 400, 0, 'Silk QC Robe', '/avatars/clothing_silk_qc_robe.svg'),
  ('clothing_pupil_gown', 'clothing_top', 'common', 80, 0, 'Pupil Gown', '/avatars/clothing_pupil_gown.svg'),
  ('clothing_scarlet_robe', 'clothing_top', 'legendary', 0, 300, 'Scarlet Robe', '/avatars/clothing_scarlet_robe.svg'),

  -- Clothing bottom
  ('clothing_pinstripe', 'clothing_bottom', 'common', 40, 0, 'Pinstripe Trousers', '/avatars/clothing_pinstripe.svg'),
  ('clothing_ermine_trim', 'clothing_bottom', 'epic', 250, 0, 'Ermine-Trimmed Robe', '/avatars/clothing_ermine_trim.svg'),

  -- Accessories
  ('accessory_gavel', 'accessory', 'rare', 120, 0, 'Golden Gavel', '/avatars/accessory_gavel.svg'),
  ('accessory_scales', 'accessory', 'epic', 350, 0, 'Scales of Justice', '/avatars/accessory_scales.svg'),
  ('accessory_quill', 'accessory', 'common', 25, 0, 'Feather Quill', '/avatars/accessory_quill.svg'),
  ('accessory_sword', 'accessory', 'legendary', 0, 250, 'Sword of Truth', '/avatars/accessory_sword.svg'),

  -- Backgrounds
  ('background_courtroom', 'background', 'rare', 180, 0, 'Courtroom', '/avatars/background_courtroom.svg'),
  ('background_library', 'background', 'common', 60, 0, 'Law Library', '/avatars/background_library.svg'),
  ('background_old_bailey', 'background', 'epic', 400, 0, 'Old Bailey', '/avatars/background_old_bailey.svg'),
  ('background_supreme_court', 'background', 'legendary', 0, 400, 'Supreme Court', '/avatars/background_supreme_court.svg'),
  ('background_rainbow', 'background', 'mythic', 0, 0, 'Rainbow of Rights', '/avatars/background_rainbow.svg'),

  -- Pets
  ('pet_phoenix', 'pet', 'mythic', 0, 0, 'Phoenix of Precedent', '/avatars/pet_phoenix.svg'),
  ('pet_owl', 'pet', 'rare', 200, 0, 'Wise Owl', '/avatars/pet_owl.svg'),
  ('pet_bulldog', 'pet', 'common', 80, 0, 'Tenacious Bulldog', '/avatars/pet_bulldog.svg'),
  ('pet_griffin', 'pet', 'legendary', 0, 350, 'Griffin of the Crown', '/avatars/pet_griffin.svg'),

  -- Emotes
  ('emote_objection', 'emote', 'rare', 100, 0, 'OBJECTION!', '/avatars/emote_objection.svg'),
  ('emote_sustained', 'emote', 'common', 40, 0, 'Sustained!', '/avatars/emote_sustained.svg'),
  ('emote_overruled', 'emote', 'epic', 200, 0, 'Overruled!', '/avatars/emote_overruled.svg');

-- Index for fast inventory lookups
CREATE INDEX IF NOT EXISTS idx_user_items_user_id ON public.user_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_items_item_id ON public.user_items(item_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(type);
CREATE INDEX IF NOT EXISTS idx_items_rarity ON public.items(rarity);
