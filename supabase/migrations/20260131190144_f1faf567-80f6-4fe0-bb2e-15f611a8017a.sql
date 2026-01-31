-- AnimeForge Decentralized Anime Studio Schema
-- =============================================

-- 1. Create Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'creator', 'patron');
CREATE TYPE public.project_status AS ENUM ('draft', 'pilot', 'funding', 'funded', 'production', 'completed');
CREATE TYPE public.funding_tier AS ENUM ('seed', 'hype', 'production', 'premiere');

-- 2. User Roles Table (for RBAC)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Helper Function: Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Style Library Table (ethical style tags)
CREATE TABLE public.style_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    preview_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.style_library ENABLE ROW LEVEL SECURITY;

-- 6. Projects Table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    status project_status NOT NULL DEFAULT 'draft',
    funding_tier funding_tier NOT NULL DEFAULT 'seed',
    funding_goal DECIMAL(12,2) NOT NULL DEFAULT 0,
    funding_current DECIMAL(12,2) NOT NULL DEFAULT 0,
    funding_percentage INTEGER GENERATED ALWAYS AS (
        CASE WHEN funding_goal > 0 THEN LEAST(100, FLOOR((funding_current / funding_goal) * 100)) ELSE 0 END
    ) STORED,
    bonding_curve_price DECIMAL(12,6) NOT NULL DEFAULT 0.01,
    cover_image_url TEXT,
    story_bible JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 7. Character Seeds Table (Style DNA)
CREATE TABLE public.character_seeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'supporting',
    style_dna JSONB NOT NULL DEFAULT '{}',
    personality TEXT[] DEFAULT '{}',
    backstory TEXT,
    abilities TEXT[] DEFAULT '{}',
    appearance TEXT,
    reference_image_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.character_seeds ENABLE ROW LEVEL SECURITY;

-- 8. Manga Panels Table (Keyframes)
CREATE TABLE public.manga_panels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    chapter_number INTEGER NOT NULL DEFAULT 1,
    page_number INTEGER NOT NULL DEFAULT 1,
    panel_position INTEGER NOT NULL DEFAULT 0,
    prompt_data JSONB NOT NULL DEFAULT '{}',
    dialogue TEXT,
    description TEXT,
    image_url TEXT,
    is_keyframe BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.manga_panels ENABLE ROW LEVEL SECURITY;

-- 9. Director Choices Table (Human-in-the-Loop)
CREATE TABLE public.director_choices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    panel_id UUID REFERENCES public.manga_panels(id) ON DELETE CASCADE,
    choice_type TEXT NOT NULL DEFAULT 'panel',
    variations JSONB NOT NULL DEFAULT '[]',
    selected_index INTEGER,
    selected_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    selected_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.director_choices ENABLE ROW LEVEL SECURITY;

-- 10. Provenance Logs Table (Immutable Audit Trail)
CREATE TABLE public.provenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB NOT NULL DEFAULT '{}',
    prompt_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.provenance_logs ENABLE ROW LEVEL SECURITY;

-- 11. Funding Transactions Table
CREATE TABLE public.funding_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    credits_received INTEGER NOT NULL DEFAULT 0,
    price_at_purchase DECIMAL(12,6) NOT NULL,
    transaction_type TEXT NOT NULL DEFAULT 'fund',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.funding_transactions ENABLE ROW LEVEL SECURITY;

-- 12. Project Rights Table (IP Marketplace)
CREATE TABLE public.project_rights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    holder_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rights_type TEXT NOT NULL DEFAULT 'producer',
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    is_tradeable BOOLEAN NOT NULL DEFAULT true,
    acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    price_paid DECIMAL(12,2),
    metadata JSONB DEFAULT '{}'
);

ALTER TABLE public.project_rights ENABLE ROW LEVEL SECURITY;

-- 13. Helper Functions

-- Check if user is project owner
CREATE OR REPLACE FUNCTION public.is_project_owner(_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = _project_id AND created_by = auth.uid()
  )
$$;

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply timestamp triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_character_seeds_updated_at BEFORE UPDATE ON public.character_seeds
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manga_panels_updated_at BEFORE UPDATE ON public.manga_panels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  -- Assign default 'creator' role to all new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'creator');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Provenance logging trigger
CREATE OR REPLACE FUNCTION public.log_provenance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.provenance_logs (project_id, entity_type, entity_id, action, user_id, details)
  VALUES (
    COALESCE(NEW.project_id, OLD.project_id),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    auth.uid(),
    jsonb_build_object(
      'old', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
      'new', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply provenance triggers to key tables
CREATE TRIGGER log_manga_panels_provenance AFTER INSERT OR UPDATE OR DELETE ON public.manga_panels
FOR EACH ROW EXECUTE FUNCTION public.log_provenance();

CREATE TRIGGER log_director_choices_provenance AFTER INSERT OR UPDATE ON public.director_choices
FOR EACH ROW EXECUTE FUNCTION public.log_provenance();

CREATE TRIGGER log_character_seeds_provenance AFTER INSERT OR UPDATE OR DELETE ON public.character_seeds
FOR EACH ROW EXECUTE FUNCTION public.log_provenance();

-- 14. RLS Policies

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies (admin only)
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

-- Style library policies
CREATE POLICY "Style library is public" ON public.style_library FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage styles" ON public.style_library FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Projects policies
CREATE POLICY "Public projects are viewable" ON public.projects FOR SELECT
USING (status IN ('funding', 'funded', 'production', 'completed') OR created_by = auth.uid());
CREATE POLICY "Creators can create projects" ON public.projects FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners can update projects" ON public.projects FOR UPDATE
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE
USING (public.has_role(auth.uid(), 'admin') OR created_by = auth.uid());

-- Character seeds policies
CREATE POLICY "Owners can view character seeds" ON public.character_seeds FOR SELECT
USING (public.is_project_owner(project_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can create character seeds" ON public.character_seeds FOR INSERT
WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY "Owners can update character seeds" ON public.character_seeds FOR UPDATE
USING (public.is_project_owner(project_id));
CREATE POLICY "Owners can delete character seeds" ON public.character_seeds FOR DELETE
USING (public.is_project_owner(project_id));

-- Manga panels policies
CREATE POLICY "Project members can view panels" ON public.manga_panels FOR SELECT
USING (public.is_project_owner(project_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can create panels" ON public.manga_panels FOR INSERT
WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY "Owners can update panels" ON public.manga_panels FOR UPDATE
USING (public.is_project_owner(project_id));
CREATE POLICY "Owners can delete panels" ON public.manga_panels FOR DELETE
USING (public.is_project_owner(project_id));

-- Director choices policies
CREATE POLICY "Project members can view choices" ON public.director_choices FOR SELECT
USING (public.is_project_owner(project_id) OR selected_by = auth.uid());
CREATE POLICY "Owners can create choices" ON public.director_choices FOR INSERT
WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY "Users can update own selections" ON public.director_choices FOR UPDATE
USING (selected_by = auth.uid() OR public.is_project_owner(project_id));

-- Provenance logs policies (read-only for owners)
CREATE POLICY "Project owners can view provenance" ON public.provenance_logs FOR SELECT
USING (public.is_project_owner(project_id) OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert provenance" ON public.provenance_logs FOR INSERT
WITH CHECK (true);

-- Funding transactions policies
CREATE POLICY "Users can view own transactions" ON public.funding_transactions FOR SELECT
USING (user_id = auth.uid() OR public.is_project_owner(project_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can fund" ON public.funding_transactions FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Project rights policies
CREATE POLICY "Rights are viewable by stakeholders" ON public.project_rights FOR SELECT
USING (holder_id = auth.uid() OR public.is_project_owner(project_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can manage rights" ON public.project_rights FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.is_project_owner(project_id));

-- 15. Insert default style library entries
INSERT INTO public.style_library (name, description, tags) VALUES
('Ghibli Dreamscape', 'Soft watercolor aesthetics with lush environments', ARRAY['pastoral', 'whimsical', 'watercolor', 'nature']),
('Trigger Impact', 'Dynamic poses, bold lines, explosive action', ARRAY['action', 'dynamic', 'bold', 'kinetic']),
('Mappa Cinematic', 'Dramatic lighting, realistic proportions', ARRAY['cinematic', 'dramatic', 'realistic', 'shadows']),
('Ufotable Flow', 'Fluid animation-ready, particle effects emphasis', ARRAY['fluid', 'particles', 'magic', 'glow']),
('Bones Dynamic', 'Expressive characters, detailed backgrounds', ARRAY['expressive', 'detailed', 'emotional', 'vibrant']),
('Kyoani Soft', 'Beautiful character designs, soft lighting', ARRAY['soft', 'beautiful', 'slice-of-life', 'warm']),
('Wit Titan', 'Epic scale, intense expressions, action-focused', ARRAY['epic', 'intense', 'battle', 'scale']),
('Shaft Abstract', 'Unique angles, symbolic imagery, avant-garde', ARRAY['abstract', 'symbolic', 'unique', 'artistic']);