import { useState } from "react";
import { Project, StoryBible, Character, CREATION_STEPS } from "@/types/anime";

export interface GlobalProjectState {
  project: Project | null;
  storyBible: StoryBible | null;
  characters: Character[];
  currentStep: string;
}

const initialState: GlobalProjectState = {
  project: null,
  storyBible: null,
  characters: [],
  currentStep: "story",
};

export function useProjectState() {
  const [state, setState] = useState<GlobalProjectState>(initialState);

  const setProject = (project: Project) => {
    setState((prev) => ({ ...prev, project }));
  };

  const setStoryBible = (storyBible: StoryBible) => {
    setState((prev) => ({ ...prev, storyBible }));
  };

  const addCharacter = (character: Character) => {
    setState((prev) => ({
      ...prev,
      characters: [...prev.characters, character],
    }));
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setState((prev) => ({
      ...prev,
      characters: prev.characters.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const removeCharacter = (id: string) => {
    setState((prev) => ({
      ...prev,
      characters: prev.characters.filter((c) => c.id !== id),
    }));
  };

  const setCurrentStep = (step: string) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const getProgress = () => {
    const stepIndex = CREATION_STEPS.findIndex(
      (s) => s.id === state.currentStep
    );
    return Math.round((stepIndex / (CREATION_STEPS.length - 1)) * 100);
  };

  const resetProject = () => {
    setState(initialState);
  };

  return {
    ...state,
    setProject,
    setStoryBible,
    addCharacter,
    updateCharacter,
    removeCharacter,
    setCurrentStep,
    getProgress,
    resetProject,
  };
}
