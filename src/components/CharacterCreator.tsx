import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressSteps } from "@/components/ProgressSteps";
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Wand2,
  User,
  Sword,
  Heart,
  Crown,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Character } from "@/types/anime";

const SAMPLE_CHARACTERS: Character[] = [
  {
    id: "1",
    name: "Akira Yamamoto",
    role: "protagonist",
    personality: ["Determined", "Kind", "Reckless"],
    backstory: "An orphan who discovered they possess ancient elemental powers when their village was attacked.",
    abilities: ["Fire manipulation", "Enhanced agility", "Spirit connection"],
    appearance: "Spiky black hair with red streaks, amber eyes, athletic build. Wears a tattered red scarf.",
  },
  {
    id: "2",
    name: "Yuki Tanaka",
    role: "supporting",
    personality: ["Intelligent", "Reserved", "Loyal"],
    backstory: "A prodigy from the Academy of Elements who left everything to help Akira on their quest.",
    abilities: ["Ice manipulation", "Strategic genius", "Healing arts"],
    appearance: "Long silver hair, ice-blue eyes, elegant posture. Traditional blue robes with silver embroidery.",
  },
];

export function CharacterCreator() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>(SAMPLE_CHARACTERS);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCharacter = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const newCharacter: Character = {
        id: Date.now().toString(),
        name: "New Character",
        role: "supporting",
        personality: ["Mysterious", "Skilled"],
        backstory: "A wandering warrior with a hidden past...",
        abilities: ["Unknown"],
        appearance: "Cloaked figure with piercing eyes.",
      };
      setCharacters((prev) => [...prev, newCharacter]);
      setSelectedCharacter(newCharacter);
      setIsGenerating(false);
    }, 2000);
  };

  const getRoleIcon = (role: Character["role"]) => {
    switch (role) {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Story</span>
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">AnimeForge</span>
          </div>

          <Button variant="glow" size="sm" onClick={() => navigate("/manga")}>
            Next: Manga
          </Button>
        </div>

        <ProgressSteps currentStep="characters" />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Character List Sidebar */}
        <aside className="w-80 border-r border-border bg-card/30 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl">Characters</h2>
            <Button
              variant="glow"
              size="sm"
              onClick={handleGenerateCharacter}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {characters.map((character) => (
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <User className="w-6 h-6" />
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
            ))}
          </div>

          <Button
            variant="heroOutline"
            className="w-full mt-6"
            onClick={handleGenerateCharacter}
            disabled={isGenerating}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>
        </aside>

        {/* Character Details */}
        <main className="flex-1 p-8 overflow-y-auto">
          {selectedCharacter ? (
            <div className="max-w-2xl animate-fade-in">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0">
                  <User className="w-16 h-16" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={selectedCharacter.name}
                    onChange={(e) =>
                      setSelectedCharacter({
                        ...selectedCharacter,
                        name: e.target.value,
                      })
                    }
                    className="text-3xl font-display font-bold bg-transparent border-none outline-none w-full"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleIcon(selectedCharacter.role)}
                    <span className="text-muted-foreground capitalize">
                      {selectedCharacter.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Personality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacter.personality.map((trait) => (
                        <span
                          key={trait}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Backstory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={selectedCharacter.backstory}
                      onChange={(e) =>
                        setSelectedCharacter({
                          ...selectedCharacter,
                          backstory: e.target.value,
                        })
                      }
                      className="w-full bg-transparent border-none outline-none resize-none text-muted-foreground leading-relaxed"
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Abilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacter.abilities?.map((ability) => (
                        <span
                          key={ability}
                          className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm"
                        >
                          {ability}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={selectedCharacter.appearance}
                      onChange={(e) =>
                        setSelectedCharacter({
                          ...selectedCharacter,
                          appearance: e.target.value,
                        })
                      }
                      className="w-full bg-transparent border-none outline-none resize-none text-muted-foreground leading-relaxed"
                      rows={3}
                    />
                    <Button variant="ocean" size="sm" className="mt-4">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Visual
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
    </div>
  );
}
