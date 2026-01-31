import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CharacterSeed } from "@/types/database";
import {
  Plus,
  User,
  Wand2,
  Sword,
  Heart,
  Crown,
  RefreshCw,
  Trash2,
  Dna,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CharacterVaultProps {
  projectId: string;
  characters: CharacterSeed[];
  onCharactersChange: (characters: CharacterSeed[]) => void;
}

export function CharacterVault({
  projectId,
  characters,
  onCharactersChange,
}: CharacterVaultProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterSeed | null>(
    characters[0] || null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "protagonist":
        return <Sword className="w-4 h-4 text-primary" />;
      case "antagonist":
        return <Crown className="w-4 h-4 text-destructive" />;
      case "supporting":
        return <Heart className="w-4 h-4 text-secondary" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleCreateCharacter = async () => {
    try {
      const { data, error } = await supabase
        .from("character_seeds")
        .insert({
          project_id: projectId,
          name: "New Character",
          role: "supporting",
          personality: ["Mysterious"],
          style_dna: {},
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      const newCharacter = data as CharacterSeed;
      onCharactersChange([...characters, newCharacter]);
      setSelectedCharacter(newCharacter);
      toast({ title: "Character created!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create character",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCharacter = async (updates: Partial<CharacterSeed>) => {
    if (!selectedCharacter) return;

    try {
      const { error } = await supabase
        .from("character_seeds")
        .update(updates)
        .eq("id", selectedCharacter.id);

      if (error) throw error;

      const updatedCharacter = { ...selectedCharacter, ...updates };
      onCharactersChange(
        characters.map((c) =>
          c.id === selectedCharacter.id ? updatedCharacter : c
        )
      );
      setSelectedCharacter(updatedCharacter);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update character",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCharacter = async () => {
    if (!selectedCharacter) return;

    try {
      const { error } = await supabase
        .from("character_seeds")
        .delete()
        .eq("id", selectedCharacter.id);

      if (error) throw error;

      const remaining = characters.filter((c) => c.id !== selectedCharacter.id);
      onCharactersChange(remaining);
      setSelectedCharacter(remaining[0] || null);
      toast({ title: "Character deleted" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete character",
        variant: "destructive",
      });
    }
  };

  const handleGenerateStyleDNA = async () => {
    if (!selectedCharacter) return;
    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const styleDNA = {
        face_shape: "angular",
        eye_style: "sharp",
        hair_color: "#2a1f5c",
        hair_style: "spiky",
        color_palette: ["#ff4081", "#00bcd4", "#1a1a2e"],
        line_weight: "medium",
        shading_style: "cel",
      };

      handleUpdateCharacter({ style_dna: styleDNA });
      setIsGenerating(false);
      toast({ title: "Style DNA generated!" });
    }, 2000);
  };

  return (
    <div className="h-full flex">
      {/* Character List */}
      <aside className="w-80 border-r border-border bg-card/30 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Dna className="w-5 h-5 text-primary" />
            Character Seeds
          </h2>
          <Button variant="glow" size="sm" onClick={handleCreateCharacter}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {characters.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">No characters yet</p>
            </div>
          ) : (
            characters.map((character) => (
              <Card
                key={character.id}
                variant="interactive"
                className={
                  selectedCharacter?.id === character.id
                    ? "border-primary/50 shadow-glow-pink"
                    : ""
                }
                onClick={() => setSelectedCharacter(character)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center overflow-hidden">
                      {character.reference_image_url ? (
                        <img
                          src={character.reference_image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">
                          {character.name}
                        </span>
                        {getRoleIcon(character.role)}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {character.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </aside>

      {/* Character Details */}
      <main className="flex-1 p-8 overflow-y-auto">
        {selectedCharacter ? (
          <div className="max-w-2xl animate-fade-in">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0 overflow-hidden">
                {selectedCharacter.reference_image_url ? (
                  <img
                    src={selectedCharacter.reference_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  value={selectedCharacter.name}
                  onChange={(e) => handleUpdateCharacter({ name: e.target.value })}
                  className="text-3xl font-display font-bold bg-transparent border-none h-auto p-0 mb-2"
                />
                <div className="flex items-center gap-2">
                  {getRoleIcon(selectedCharacter.role)}
                  <select
                    value={selectedCharacter.role}
                    onChange={(e) => handleUpdateCharacter({ role: e.target.value })}
                    className="bg-transparent text-muted-foreground capitalize cursor-pointer"
                  >
                    <option value="protagonist">Protagonist</option>
                    <option value="antagonist">Antagonist</option>
                    <option value="supporting">Supporting</option>
                    <option value="mentor">Mentor</option>
                  </select>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={handleDeleteCharacter}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Style DNA */}
              <Card variant="elevated" className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Dna className="w-4 h-4 text-primary" />
                    Style DNA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(selectedCharacter.style_dna).length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedCharacter.style_dna).map(
                        ([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-muted-foreground capitalize">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="font-medium">
                              {Array.isArray(value)
                                ? value.join(", ")
                                : String(value)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm mb-4">
                      No Style DNA generated yet. Generate to ensure visual
                      consistency across all panels.
                    </p>
                  )}
                  <Button
                    variant="ocean"
                    size="sm"
                    className="mt-4"
                    onClick={handleGenerateStyleDNA}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 mr-2" />
                    )}
                    {Object.keys(selectedCharacter.style_dna).length > 0
                      ? "Regenerate DNA"
                      : "Generate Style DNA"}
                  </Button>
                </CardContent>
              </Card>

              {/* Personality */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Personality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.personality.map((trait, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {trait}
                      </span>
                    ))}
                    <button className="px-3 py-1 rounded-full border border-dashed border-border text-sm text-muted-foreground hover:border-primary/50">
                      + Add trait
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Backstory */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Backstory</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedCharacter.backstory || ""}
                    onChange={(e) =>
                      handleUpdateCharacter({ backstory: e.target.value })
                    }
                    placeholder="Enter character backstory..."
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Appearance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedCharacter.appearance || ""}
                    onChange={(e) =>
                      handleUpdateCharacter({ appearance: e.target.value })
                    }
                    placeholder="Describe visual appearance..."
                    className="min-h-[100px] resize-none"
                  />
                  <Button variant="ocean" size="sm" className="mt-4">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Reference Image
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-xl text-muted-foreground">
                Select a character or create a new one
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
