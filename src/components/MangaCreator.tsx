import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressSteps } from "@/components/ProgressSteps";
import {
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Wand2,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Panel {
  id: string;
  content: string;
  dialogue?: string;
  position: number;
}

interface Page {
  id: string;
  number: number;
  panels: Panel[];
}

const SAMPLE_PAGES: Page[] = [
  {
    id: "1",
    number: 1,
    panels: [
      { id: "p1-1", content: "Wide establishing shot of a mystical village at sunset", position: 0 },
      { id: "p1-2", content: "Akira standing alone, looking at the horizon", dialogue: "This is where it all begins...", position: 1 },
      { id: "p1-3", content: "Close-up of Akira's determined eyes", position: 2 },
      { id: "p1-4", content: "Mysterious figure watching from the shadows", position: 3 },
    ],
  },
  {
    id: "2",
    number: 2,
    panels: [
      { id: "p2-1", content: "Akira walking through the village marketplace", position: 0 },
      { id: "p2-2", content: "Elder approaches Akira with a scroll", dialogue: "Young one, your destiny awaits...", position: 1 },
      { id: "p2-3", content: "Dramatic reveal of ancient prophecy on scroll", position: 2 },
    ],
  },
];

export function MangaCreator() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>(SAMPLE_PAGES);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentPage = pages[currentPageIndex];

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handleGeneratePage = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPage: Page = {
        id: Date.now().toString(),
        number: pages.length + 1,
        panels: [
          { id: `${Date.now()}-1`, content: "New panel - click to edit", position: 0 },
          { id: `${Date.now()}-2`, content: "New panel - click to edit", position: 1 },
        ],
      };
      setPages([...pages, newPage]);
      setCurrentPageIndex(pages.length);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/characters")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Characters</span>
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">AnimeForge</span>
          </div>

          <Button variant="glow" size="sm">
            Next: Animate
          </Button>
        </div>

        <ProgressSteps currentStep="manga" />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Page Thumbnails */}
        <aside className="w-24 border-r border-border bg-card/30 p-4 overflow-y-auto">
          <div className="space-y-4">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => setCurrentPageIndex(index)}
                className={`w-full aspect-[3/4] rounded-lg border-2 transition-all ${
                  index === currentPageIndex
                    ? "border-primary shadow-glow-pink"
                    : "border-border hover:border-primary/50"
                } bg-card flex items-center justify-center`}
              >
                <span className="text-sm font-medium">{page.number}</span>
              </button>
            ))}
            <button
              onClick={handleGeneratePage}
              disabled={isGenerating}
              className="w-full aspect-[3/4] rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-transparent flex items-center justify-center transition-all"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <Plus className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </aside>

        {/* Manga Page View */}
        <main className="flex-1 p-8 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPageIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-medium">
              Page {currentPage?.number} of {pages.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPageIndex === pages.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Manga Page */}
          <Card variant="elevated" className="w-full max-w-2xl aspect-[3/4]">
            <CardContent className="p-6 h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                {currentPage?.panels.map((panel, index) => (
                  <div
                    key={panel.id}
                    className={`relative group rounded-lg border-2 border-border bg-muted/20 hover:border-primary/50 transition-all cursor-pointer ${
                      index === 0 ? "col-span-2" : ""
                    }`}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        {panel.content}
                      </p>
                      {panel.dialogue && (
                        <div className="bg-background/80 rounded-lg px-3 py-2 max-w-[80%]">
                          <p className="text-xs italic">"{panel.dialogue}"</p>
                        </div>
                      )}
                    </div>

                    {/* Panel Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <Button variant="heroOutline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Panels
            </Button>
            <Button variant="ocean">
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Visuals
            </Button>
          </div>
        </main>

        {/* Chapter Info */}
        <aside className="w-80 border-l border-border bg-card/30 p-6 overflow-y-auto">
          <h2 className="font-display font-bold text-xl mb-4">Chapter 1</h2>
          <p className="text-muted-foreground text-sm mb-6">
            "The Beginning of the Journey"
          </p>

          <div className="space-y-4">
            <Card variant="default">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground">
                  Akira discovers their hidden powers when an ancient prophecy is revealed by the village elder.
                </p>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Characters in Scene</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                    Akira
                  </span>
                  <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                    Elder
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
