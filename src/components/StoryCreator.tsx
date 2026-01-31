import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressSteps } from "@/components/ProgressSteps";
import {
  Send,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Wand2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "assistant",
  content: `✨ **Welcome to AnimeForge!**

I'm your AI Co-Creator, and I'm thrilled to help you bring your anime vision to life!

Let's start with the basics. What kind of anime would you like to create?

**Some ideas to spark your imagination:**
• 🗡️ An epic shonen adventure with powerful battles
• 💕 A heartwarming romance with supernatural elements
• 🌌 A sci-fi thriller set in a dystopian future
• 🏫 A slice-of-life story in a magical academy
• 🔮 A dark fantasy with complex moral choices

Tell me your vision — even a rough idea works! I'll help you shape it into something amazing.`,
};

const STORY_PROMPTS = [
  "A story about a young hero discovering hidden powers",
  "A romance between rivals in a magical academy",
  "A mystery thriller in a cyberpunk city",
  "An isekai adventure in a fantasy world",
];

export function StoryCreator() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (replace with actual AI call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">AnimeForge</span>
          </div>

          <Button variant="ghost" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Story Bible
          </Button>
        </div>

        <ProgressSteps currentStep="story" />
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-slide-up`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                      : "bg-card border border-border rounded-2xl rounded-bl-sm"
                  } px-5 py-4`}
                >
                  <div className="prose prose-sm prose-invert">
                    {message.content.split("\n").map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">
                        {line.startsWith("**") ? (
                          <strong>
                            {line.replace(/\*\*/g, "")}
                          </strong>
                        ) : line.startsWith("•") ? (
                          <span className="block pl-2">{line}</span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Prompts */}
        {messages.length <= 2 && (
          <div className="px-6 pb-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-muted-foreground mb-3">
                Quick starters:
              </p>
              <div className="flex flex-wrap gap-2">
                {STORY_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-4 py-2 rounded-full bg-card border border-border text-sm hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border bg-card/50 backdrop-blur-xl p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Describe your anime idea..."
                  className="w-full px-5 py-4 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none outline-none transition-all min-h-[56px] max-h-[200px]"
                  rows={1}
                />
              </div>
              <Button
                variant="glow"
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="h-14 w-14 shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </p>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Random Idea
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateMockResponse(userInput: string): string {
  const responses = [
    `That's a fantastic concept! I love the direction you're taking.

Let me help you develop this further. Here's what I'm envisioning:

**Genre:** ${userInput.includes("romance") ? "Romance / Fantasy" : userInput.includes("hero") ? "Shonen / Action" : "Fantasy / Adventure"}

**Core Conflict:** A powerful internal and external struggle that drives the narrative.

Now, let's dig deeper:

1. **Setting:** Where does this story take place? A modern city with hidden magic? A completely fantastical world? A future Earth?

2. **Time Period:** Is this contemporary, historical, or futuristic?

3. **Mood:** Should this feel dark and gritty, lighthearted and fun, or somewhere in between?

What speaks to you?`,
    `Excellent choice! I can already see this anime taking shape.

**Working Title Ideas:**
• "Echoes of the Forgotten"
• "The Last Horizon"
• "Shattered Stars"

Let's establish your world's rules:

**Key Questions:**
• What makes your world unique? (Magic system, technology, society structure)
• What's the biggest threat or mystery?
• What resources or powers are people fighting over?

Tell me more about the world you're imagining! 🌟`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
