import { Sparkles, BookOpen, Users, Film, Music, Share2 } from "lucide-react";

export interface CreationStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  color: string;
  progress: number;
}

export const CREATION_STEPS: CreationStep[] = [
  {
    id: "story",
    title: "Story",
    description: "Create your world and plot",
    icon: BookOpen,
    color: "step-story",
    progress: 0,
  },
  {
    id: "characters",
    title: "Characters",
    description: "Design your cast",
    icon: Users,
    color: "step-character",
    progress: 0,
  },
  {
    id: "manga",
    title: "Manga",
    description: "Generate panels & chapters",
    icon: Sparkles,
    color: "step-manga",
    progress: 0,
  },
  {
    id: "anime",
    title: "Animate",
    description: "Bring scenes to life",
    icon: Film,
    color: "step-anime",
    progress: 0,
  },
  {
    id: "audio",
    title: "Audio",
    description: "Add voices & music",
    icon: Music,
    color: "step-publish",
    progress: 0,
  },
  {
    id: "publish",
    title: "Publish",
    description: "Share with the world",
    icon: Share2,
    color: "step-publish",
    progress: 0,
  },
];

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  currentStep: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  name: string;
  role: "protagonist" | "antagonist" | "supporting" | "minor";
  personality: string[];
  backstory: string;
  abilities?: string[];
  appearance: string;
  imageUrl?: string;
}

export interface StoryBible {
  id: string;
  genre: string[];
  setting: string;
  worldRules: string[];
  plotSummary: string;
  themes: string[];
  arcs: StoryArc[];
}

export interface StoryArc {
  id: string;
  title: string;
  summary: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  synopsis: string;
  scenes: Scene[];
}

export interface Scene {
  id: string;
  description: string;
  characters: string[];
  dialogue?: DialogueLine[];
}

export interface DialogueLine {
  characterId: string;
  text: string;
  emotion?: string;
}

export interface MangaPanel {
  id: string;
  sceneId: string;
  imageUrl?: string;
  dialogue?: string;
  position: number;
}

export interface MangaPage {
  id: string;
  chapterNumber: number;
  pageNumber: number;
  panels: MangaPanel[];
}
