import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Project, CharacterSeed, MangaPanel } from "@/types/database";
import {
  Plus,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Check,
  RefreshCw,
  Layers,
  Play,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DirectorChoice } from "@/components/studio/DirectorChoice";

interface DirectorStudioProps {
  project: Project;
  characters: CharacterSeed[];
  panels: MangaPanel[];
  onPanelsChange: (panels: MangaPanel[]) => void;
}

export function DirectorStudio({
  project,
  characters,
  panels,
  onPanelsChange,
}: DirectorStudioProps) {
  const { toast } = useToast();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDirectorChoice, setShowDirectorChoice] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<MangaPanel | null>(null);

  const currentPanels = panels.filter(
    (p) => p.chapter_number === currentChapter && p.page_number === currentPage
  );

  const maxPage = Math.max(...panels.map((p) => p.page_number), 1);
  const keyframes = panels.filter((p) => p.is_keyframe);

  const handleAddPanel = async () => {
    try {
      const newPosition = currentPanels.length;
      const { data, error } = await supabase
        .from("manga_panels")
        .insert({
          project_id: project.id,
          chapter_number: currentChapter,
          page_number: currentPage,
          panel_position: newPosition,
          description: "New panel - click to edit",
          prompt_data: {},
        })
        .select()
        .single();

      if (error) throw error;
      onPanelsChange([...panels, data as MangaPanel]);
      toast({ title: "Panel added" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add panel",
        variant: "destructive",
      });
    }
  };

  const handleGenerateVariations = async (panel: MangaPanel) => {
    setSelectedPanel(panel);
    setShowDirectorChoice(true);
  };

  const handleSelectVariation = async (variationIndex: number, imageUrl: string) => {
    if (!selectedPanel) return;

    try {
      const { error } = await supabase
        .from("manga_panels")
        .update({ image_url: imageUrl })
        .eq("id", selectedPanel.id);

      if (error) throw error;

      onPanelsChange(
        panels.map((p) =>
          p.id === selectedPanel.id ? { ...p, image_url: imageUrl } : p
        )
      );

      setShowDirectorChoice(false);
      setSelectedPanel(null);
      toast({ title: "Director's choice saved!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save choice",
        variant: "destructive",
      });
    }
  };

  const handleToggleKeyframe = async (panel: MangaPanel) => {
    try {
      const { error } = await supabase
        .from("manga_panels")
        .update({ is_keyframe: !panel.is_keyframe })
        .eq("id", panel.id);

      if (error) throw error;

      onPanelsChange(
        panels.map((p) =>
          p.id === panel.id ? { ...p, is_keyframe: !p.is_keyframe } : p
        )
      );

      toast({
        title: panel.is_keyframe ? "Keyframe removed" : "Keyframe set",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update keyframe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex">
      {/* Keyframes Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          Keyframes ({keyframes.length})
        </h3>
        <div className="space-y-2">
          {keyframes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Mark panels as keyframes to use them for animation.
            </p>
          ) : (
            keyframes.map((kf) => (
              <Card
                key={kf.id}
                variant="interactive"
                className="cursor-pointer"
                onClick={() => {
                  setCurrentChapter(kf.chapter_number);
                  setCurrentPage(kf.page_number);
                }}
              >
                <CardContent className="p-2">
                  <div className="aspect-video bg-muted rounded overflow-hidden mb-2">
                    {kf.image_url ? (
                      <img
                        src={kf.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <p className="text-xs truncate">{kf.description || "Untitled"}</p>
                  <p className="text-xs text-muted-foreground">
                    Ch{kf.chapter_number} P{kf.page_number}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button
            variant="ocean"
            className="w-full"
            disabled={keyframes.length < 2}
          >
            <Play className="w-4 h-4 mr-2" />
            Generate Animation
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Need 2+ keyframes to animate
          </p>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Page Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-medium">
              Chapter {currentChapter}, Page {currentPage}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <Button variant="heroOutline" onClick={handleAddPanel}>
            <Plus className="w-4 h-4 mr-2" />
            Add Panel
          </Button>
        </div>

        {/* Manga Page Layout */}
        <Card variant="elevated" className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {currentPanels.length === 0 ? (
                <div className="col-span-2 aspect-[3/4] border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Add your first panel</p>
                  </div>
                </div>
              ) : (
                currentPanels.map((panel, index) => (
                  <div
                    key={panel.id}
                    className={`relative group rounded-lg border-2 transition-all cursor-pointer ${
                      panel.is_keyframe
                        ? "border-primary shadow-glow-pink"
                        : "border-border hover:border-primary/50"
                    } ${index === 0 && currentPanels.length > 2 ? "col-span-2" : ""}`}
                  >
                    <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden">
                      {panel.image_url ? (
                        <img
                          src={panel.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-2">
                            {panel.description || "Empty panel"}
                          </p>
                          {panel.dialogue && (
                            <div className="bg-background/80 rounded-lg px-3 py-2 max-w-[80%]">
                              <p className="text-xs italic">"{panel.dialogue}"</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Panel Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleKeyframe(panel);
                        }}
                        title={panel.is_keyframe ? "Remove keyframe" : "Set as keyframe"}
                      >
                        <Layers
                          className={`w-3 h-3 ${
                            panel.is_keyframe ? "text-primary" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="glow"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateVariations(panel);
                        }}
                        title="Generate variations (Director's Choice)"
                      >
                        <Wand2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Keyframe Badge */}
                    {panel.is_keyframe && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary/90 text-primary-foreground rounded text-xs font-medium">
                        Keyframe
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Director's Choice Modal */}
      {showDirectorChoice && selectedPanel && (
        <DirectorChoice
          panel={selectedPanel}
          characters={characters}
          onSelect={handleSelectVariation}
          onClose={() => {
            setShowDirectorChoice(false);
            setSelectedPanel(null);
          }}
        />
      )}
    </div>
  );
}
