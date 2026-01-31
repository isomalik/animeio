import { CREATION_STEPS } from "@/types/anime";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ProgressStepsProps {
  currentStep: string;
  onStepClick?: (stepId: string) => void;
}

const STEP_ROUTES: Record<string, string> = {
  story: "/create",
  characters: "/characters",
  manga: "/manga",
  animation: "/animation",
  audio: "/audio",
  publish: "/publish",
};

export function ProgressSteps({ currentStep, onStepClick }: ProgressStepsProps) {
  const navigate = useNavigate();
  const currentIndex = CREATION_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {CREATION_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => {
                onStepClick?.(step.id);
                const route = STEP_ROUTES[step.id];
                if (route) navigate(route);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                isActive && "bg-primary/20 shadow-glow-pink",
                isCompleted && "opacity-100",
                !isActive && !isCompleted && "opacity-50 hover:opacity-75"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive && `bg-${step.color}`,
                  isCompleted && "bg-muted",
                  !isActive && !isCompleted && "bg-muted/50"
                )}
                style={{
                  backgroundColor: isActive
                    ? `hsl(var(--${step.color}))`
                    : undefined,
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden md:block",
                  isActive && "text-foreground",
                  !isActive && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </button>

            {index < CREATION_STEPS.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1",
                  index < currentIndex ? "bg-primary/50" : "bg-muted/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
