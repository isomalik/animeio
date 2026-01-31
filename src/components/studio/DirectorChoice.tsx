import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MangaPanel, CharacterSeed } from "@/types/database";
import { Check, X, RefreshCw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DirectorChoiceProps {
  panel: MangaPanel;
  characters: CharacterSeed[];
  onSelect: (variationIndex: number, imageUrl: string) => void;
  onClose: () => void;
}

interface Variation {
  id: string;
  description: string;
  prompt: string;
  preview_url?: string;
  style_notes: string;
}

export function DirectorChoice({
  panel,
  characters,
  onSelect,
  onClose,
}: DirectorChoiceProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setVariations([]);

    try {
      const characterContext = characters
        .map((c) => `${c.name} (${c.role}): ${c.appearance || "No description"}`)
        .join("\n");

      const { data, error } = await supabase.functions.invoke("generate-variations", {
        body: {
          panelDescription: panel.description || "Anime scene",
          dialogue: panel.dialogue,
          characterContext,
          stylePreferences: ["anime", "manga"],
        },
      });

      if (error) throw error;

      setVariations(data.variations);
      toast({ title: "Variations generated!" });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate variations",
        variant: "destructive",
      });
      // Generate mock variations for demo
      setVariations([
        {
          id: "1",
          description: "Dynamic action pose with speed lines",
          prompt: `${panel.description} - Dynamic action pose with motion blur and speed lines`,
          style_notes: "High energy, Trigger-style animation",
        },
        {
          id: "2",
          description: "Dramatic lighting with shadows",
          prompt: `${panel.description} - Dramatic cinematic lighting with deep shadows`,
          style_notes: "Mappa-style realism, strong contrast",
        },
        {
          id: "3",
          description: "Soft, dreamy atmosphere",
          prompt: `${panel.description} - Soft watercolor aesthetic with warm lighting`,
          style_notes: "Ghibli-inspired, pastoral mood",
        },
        {
          id: "4",
          description: "Abstract symbolic composition",
          prompt: `${panel.description} - Unique angles with symbolic imagery`,
          style_notes: "Shaft-style avant-garde",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = () => {
    if (selectedIndex !== null && variations[selectedIndex]) {
      onSelect(selectedIndex, variations[selectedIndex].preview_url || "");
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Director's Choice
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              AI presents 4 variations. You direct the final look.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <CardContent className="p-6 overflow-y-auto">
          {/* Panel Preview */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium mb-1">Panel Description</p>
            <p className="text-muted-foreground">{panel.description || "No description"}</p>
            {panel.dialogue && (
              <p className="mt-2 text-sm italic">"{panel.dialogue}"</p>
            )}
          </div>

          {/* Generate Button */}
          {variations.length === 0 && (
            <div className="text-center py-12">
              <Button
                variant="glow"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Variations...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate 4 Variations
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                The AI will create 4 distinct interpretations for you to choose from.
                <br />
                This ensures human authorship for IP protection.
              </p>
            </div>
          )}

          {/* Variations Grid */}
          {variations.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {variations.map((variation, index) => (
                  <Card
                    key={variation.id}
                    variant="interactive"
                    className={`cursor-pointer transition-all ${
                      selectedIndex === index
                        ? "ring-2 ring-primary shadow-glow-pink"
                        : ""
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                        {variation.preview_url ? (
                          <img
                            src={variation.preview_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-bold text-muted-foreground/20">
                            {index + 1}
                          </span>
                        )}
                        {selectedIndex === index && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="w-8 h-8 text-primary" />
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-sm mb-1">
                        Variation {index + 1}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {variation.description}
                      </p>
                      <p className="text-xs text-primary mt-2">
                        {variation.style_notes}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate All
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="glow"
                    onClick={handleConfirm}
                    disabled={selectedIndex === null}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Choice
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
