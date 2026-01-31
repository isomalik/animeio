import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Project, CharacterSeed, MangaPanel, ProjectStatus, FundingTier } from "@/types/database";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Users,
  Film,
  Wand2,
  FileText,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DirectorStudio } from "@/components/studio/DirectorStudio";
import { CharacterVault } from "@/components/studio/CharacterVault";
import { StoryBible } from "@/components/studio/StoryBible";
import { ProvenanceLog } from "@/components/studio/ProvenanceLog";

export default function Studio() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [characters, setCharacters] = useState<CharacterSeed[]>([]);
  const [panels, setPanels] = useState<MangaPanel[]>([]);
  const [activeTab, setActiveTab] = useState("director");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (projectId) {
      fetchProjectData();
    }
  }, [user, projectId, navigate]);

  async function fetchProjectData() {
    try {
      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData as Project);

      // Fetch characters
      const { data: charactersData } = await supabase
        .from("character_seeds")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      setCharacters((charactersData || []) as CharacterSeed[]);

      // Fetch panels
      const { data: panelsData } = await supabase
        .from("manga_panels")
        .select("*")
        .eq("project_id", projectId)
        .order("chapter_number", { ascending: true })
        .order("page_number", { ascending: true })
        .order("panel_position", { ascending: true });

      setPanels((panelsData || []) as MangaPanel[]);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Wand2 className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-bold">{project.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {project.status}
            </span>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          {/* Tab Navigation */}
          <div className="border-b border-border bg-card/30">
            <div className="container mx-auto px-6">
              <TabsList className="h-12 bg-transparent p-0 gap-6">
                <TabsTrigger
                  value="director"
                  className="h-12 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  <Film className="w-4 h-4 mr-2" />
                  Director's Studio
                </TabsTrigger>
                <TabsTrigger
                  value="characters"
                  className="h-12 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Character Vault
                </TabsTrigger>
                <TabsTrigger
                  value="story"
                  className="h-12 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Story Bible
                </TabsTrigger>
                <TabsTrigger
                  value="provenance"
                  className="h-12 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Provenance
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="director" className="h-full m-0">
              <DirectorStudio
                project={project}
                characters={characters}
                panels={panels}
                onPanelsChange={setPanels}
              />
            </TabsContent>
            <TabsContent value="characters" className="h-full m-0">
              <CharacterVault
                projectId={project.id}
                characters={characters}
                onCharactersChange={setCharacters}
              />
            </TabsContent>
            <TabsContent value="story" className="h-full m-0">
              <StoryBible
                project={project}
                onProjectChange={setProject}
              />
            </TabsContent>
            <TabsContent value="provenance" className="h-full m-0">
              <ProvenanceLog projectId={project.id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
