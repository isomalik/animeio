import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/database";
import { BookOpen, Wand2, Save, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StoryBibleProps {
  project: Project;
  onProjectChange: (project: Project) => void;
}

interface StoryBibleData {
  title?: string;
  logline?: string;
  genre?: string;
  setting?: string;
  themes?: string[];
  plotSummary?: string;
  worldRules?: string[];
  acts?: { name: string; description: string }[];
  [key: string]: unknown;
}

export function StoryBible({ project, onProjectChange }: StoryBibleProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyBible, setStoryBible] = useState<StoryBibleData>(
    (project.story_bible as StoryBibleData) || {}
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Cast to any for Supabase JSONB compatibility
      const storyBibleJson = JSON.parse(JSON.stringify(storyBible));
      
      const { error } = await supabase
        .from("projects")
        .update({
          name: storyBible.title || project.name,
          genre: storyBible.genre,
          story_bible: storyBibleJson,
        })
        .eq("id", project.id);

      if (error) throw error;

      onProjectChange({
        ...project,
        name: storyBible.title || project.name,
        genre: storyBible.genre || null,
        story_bible: storyBibleJson,
      });

      toast({ title: "Story bible saved!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save story bible",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setStoryBible({
        ...storyBible,
        logline:
          storyBible.logline ||
          "A young warrior discovers an ancient power that could save or destroy their world.",
        themes: storyBible.themes || ["Destiny", "Sacrifice", "Redemption"],
        worldRules: storyBible.worldRules || [
          "Magic flows from ancient crystals",
          "The gods watch but rarely intervene",
          "Technology and magic coexist uneasily",
        ],
        acts: storyBible.acts || [
          {
            name: "Act 1: The Awakening",
            description: "The protagonist discovers their hidden powers",
          },
          {
            name: "Act 2: The Journey",
            description: "Training and gathering allies for the coming storm",
          },
          {
            name: "Act 3: The Confrontation",
            description: "The final battle against the forces of darkness",
          },
        ],
      });
      setIsGenerating(false);
      toast({ title: "Story elements generated!" });
    }, 2000);
  };

  const updateField = (field: keyof StoryBibleData, value: unknown) => {
    setStoryBible({ ...storyBible, [field]: value });
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-display font-bold">Story Bible</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="heroOutline"
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Generate with AI
            </Button>
            <Button variant="glow" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title & Logline */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Core Concept</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={storyBible.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Your anime title..."
                  className="text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Logline</label>
                <Textarea
                  value={storyBible.logline || ""}
                  onChange={(e) => updateField("logline", e.target.value)}
                  placeholder="A one-sentence summary of your story..."
                  className="resize-none"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre</label>
                  <Input
                    value={storyBible.genre || ""}
                    onChange={(e) => updateField("genre", e.target.value)}
                    placeholder="e.g., Shonen, Fantasy"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Setting</label>
                  <Input
                    value={storyBible.setting || ""}
                    onChange={(e) => updateField("setting", e.target.value)}
                    placeholder="e.g., Feudal Japan meets Cyberpunk"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Themes */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {(storyBible.themes || []).map((theme, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm"
                  >
                    {theme}
                  </span>
                ))}
              </div>
              <Input
                placeholder="Add a theme and press Enter..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    updateField("themes", [
                      ...(storyBible.themes || []),
                      e.currentTarget.value,
                    ]);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Plot Summary */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Plot Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={storyBible.plotSummary || ""}
                onChange={(e) => updateField("plotSummary", e.target.value)}
                placeholder="Describe the main plot of your story..."
                className="min-h-[150px] resize-none"
              />
            </CardContent>
          </Card>

          {/* World Rules */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>World Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {(storyBible.worldRules || []).map((rule, i) => (
                  <div
                    key={i}
                    className="p-3 bg-muted/30 rounded-lg text-sm flex items-start gap-2"
                  >
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
              <Input
                placeholder="Add a world rule and press Enter..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    updateField("worldRules", [
                      ...(storyBible.worldRules || []),
                      e.currentTarget.value,
                    ]);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Story Structure */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Story Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(storyBible.acts || []).map((act, i) => (
                  <div key={i} className="p-4 border border-border rounded-lg">
                    <Input
                      value={act.name}
                      onChange={(e) => {
                        const newActs = [...(storyBible.acts || [])];
                        newActs[i] = { ...act, name: e.target.value };
                        updateField("acts", newActs);
                      }}
                      className="font-semibold mb-2 border-none p-0 h-auto"
                    />
                    <Textarea
                      value={act.description}
                      onChange={(e) => {
                        const newActs = [...(storyBible.acts || [])];
                        newActs[i] = { ...act, description: e.target.value };
                        updateField("acts", newActs);
                      }}
                      className="resize-none text-sm text-muted-foreground"
                      rows={2}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    updateField("acts", [
                      ...(storyBible.acts || []),
                      { name: "New Act", description: "" },
                    ])
                  }
                >
                  + Add Act
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
