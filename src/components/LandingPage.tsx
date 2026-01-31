import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Play, ArrowRight, Zap, Palette, Film, Mic, TrendingUp, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { useAuth } from "@/contexts/AuthContext";

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: "Director's Chair",
      description: "AI presents 4 variations—you make the creative call. Human-in-the-loop ensures copyrightable work.",
      color: "primary",
    },
    {
      icon: Palette,
      title: "Character Seeds",
      description: "Create Style DNA for visual consistency. Inject it into every panel for perfect character fidelity.",
      color: "secondary",
    },
    {
      icon: Film,
      title: "Manga Keyframes",
      description: "Build high-quality panels first. They become the ground truth for your animation engine.",
      color: "accent",
    },
    {
      icon: TrendingUp,
      title: "Bonding Curve",
      description: "Launch as a Manga Pilot. Community funds move your project up the curve to full production.",
      color: "primary",
    },
    {
      icon: Shield,
      title: "Provenance Deed",
      description: "Every prompt, edit, and choice is logged. Prove human authorship for streaming distribution.",
      color: "secondary",
    },
    {
      icon: Users,
      title: "Rights Marketplace",
      description: "Trade Executive Producer rights. Automated IP licensing for every sale.",
      color: "accent",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                The Decentralized Anime Studio
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
              <span className="text-foreground">Direct Your</span>
              <br />
              <span className="text-gradient-sunset">Anime Empire</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Create, fund, and trade anime.
              <br />
              Human-directed. Community-powered.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => navigate("/dashboard")}
                  className="group"
                >
                  <Sparkles className="w-5 h-5" />
                  Enter Studio
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={() => navigate("/auth")}
                    className="group"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start Creating
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="heroOutline"
                    size="xl"
                    onClick={() => navigate("/auth")}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              A complete pipeline from story to screen, powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="interactive"
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-${feature.color}/10 group-hover:bg-${feature.color}/20 transition-colors`}
                    style={{
                      backgroundColor: `hsl(var(--${feature.color}) / 0.1)`,
                    }}
                  >
                    <feature.icon
                      className="w-7 h-7"
                      style={{ color: `hsl(var(--${feature.color}))` }}
                    />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-gradient-ocean">Simple Flow</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Six steps to your own anime
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: "1", title: "Idea", desc: "Start with a concept" },
              { step: "2", title: "Story", desc: "Build your world" },
              { step: "3", title: "Characters", desc: "Design your cast" },
              { step: "4", title: "Manga", desc: "Generate panels" },
              { step: "5", title: "Animate", desc: "Bring to life" },
              { step: "6", title: "Share", desc: "Publish & enjoy" },
            ].map((item, index) => (
              <div
                key={item.step}
                className="text-center group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-display font-bold text-foreground group-hover:shadow-glow-pink transition-shadow">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Create Your
              <br />
              <span className="text-gradient-sunset">First Anime?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of creators bringing their anime dreams to life.
            </p>
            <Button
              variant="glow"
              size="xl"
              onClick={() => navigate("/create")}
              className="group"
            >
              <Sparkles className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">AnimeForge</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 AnimeForge. Create your story.
          </p>
        </div>
      </footer>
    </div>
  );
}
