import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  TrendingUp,
  Flame,
  ArrowLeft,
  Zap,
  Users,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

export default function Launchpad() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFundingProjects();
  }, []);

  async function fetchFundingProjects() {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .in("status", ["pilot", "funding", "funded"])
        .order("funding_current", { ascending: false });

      if (error) throw error;
      setProjects((data || []) as Project[]);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFund = async (project: Project, amount: number) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      // Calculate credits based on bonding curve
      const credits = Math.floor(amount / (project.bonding_curve_price || 0.01));
      const newPrice = (project.bonding_curve_price || 0.01) * 1.01; // 1% increase per transaction

      // Insert transaction
      const { error: txError } = await supabase
        .from("funding_transactions")
        .insert({
          project_id: project.id,
          user_id: user.id,
          amount,
          credits_received: credits,
          price_at_purchase: project.bonding_curve_price || 0.01,
          transaction_type: "fund",
        });

      if (txError) throw txError;

      // Update project funding
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          funding_current: (project.funding_current || 0) + amount,
          bonding_curve_price: newPrice,
        })
        .eq("id", project.id);

      if (updateError) throw updateError;

      toast({
        title: "Funded successfully!",
        description: `You received ${credits} credits at $${project.bonding_curve_price?.toFixed(4)}/credit`,
      });

      fetchFundingProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fund project",
        variant: "destructive",
      });
    }
  };

  const getTierColor = (tier: Project["funding_tier"]) => {
    const colors = {
      seed: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
      hype: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
      production: "from-primary/20 to-primary/5 border-primary/30",
      premiere: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    };
    return colors[tier] || colors.seed;
  };

  const getTierLabel = (tier: Project["funding_tier"]) => {
    const labels = {
      seed: "🌱 Seed",
      hype: "🔥 Hype",
      production: "🎬 Production",
      premiere: "⭐ Premiere",
    };
    return labels[tier] || labels.seed;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-xl">AnimeForge</span>
            </div>
          </div>
          {!user && (
            <Button variant="glow" onClick={() => navigate("/auth")}>
              Sign In to Fund
            </Button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Anime Bonding Curve
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            The <span className="text-gradient-sunset">Launchpad</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fund anime projects early. The earlier you back, the lower the price.
            <br />
            As hype grows, so does the bonding curve.
          </p>
        </div>
      </section>

      {/* Trending Projects */}
      <section className="py-8 container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            Trending Mints
          </h2>
          <div className="flex gap-2">
            {["all", "seed", "hype", "production"].map((filter) => (
              <Button key={filter} variant="ghost" size="sm" className="capitalize">
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="text-center py-16">
            <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">No projects in funding</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to launch your anime on the bonding curve
            </p>
            <Button variant="glow" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
              Launch Your Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className={`overflow-hidden border bg-gradient-to-b ${getTierColor(
                  project.funding_tier
                )}`}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                    {getTierLabel(project.funding_tier)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description || "A new anime project"}
                  </p>

                  {/* Funding Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        ${project.funding_current?.toFixed(0) || 0} / ${project.funding_goal?.toFixed(0) || 0}
                      </span>
                    </div>
                    <Progress value={project.funding_percentage || 0} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {project.funding_percentage || 0}% funded for Episode 1
                    </p>
                  </div>

                  {/* Bonding Curve Price */}
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Price</p>
                      <p className="font-mono font-bold text-primary">
                        ${project.bonding_curve_price?.toFixed(4) || "0.0100"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+12.3%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="glow"
                      className="flex-1"
                      onClick={() => handleFund(project, 10)}
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Fund $10
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/studio/${project.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-2xl font-display font-bold text-center mb-12">
          How the Bonding Curve Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Manga Pilot",
              description: "Creator publishes 3-5 keyframe panels as proof of concept",
            },
            {
              step: "2",
              title: "Early Funding",
              description: "Backers buy in at low prices on the bonding curve",
            },
            {
              step: "3",
              title: "Hype Phase",
              description: "Price rises as more backers join. High-res renders unlock.",
            },
            {
              step: "4",
              title: "Production",
              description: "Milestone hit! Full episode production begins with community input.",
            },
          ].map((item) => (
            <Card key={item.step} variant="glass" className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
