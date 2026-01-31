import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProvenanceLog as ProvenanceLogType } from "@/types/database";
import { FileText, User, Clock, Hash, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ProvenanceLogProps {
  projectId: string;
}

export function ProvenanceLog({ projectId }: ProvenanceLogProps) {
  const [logs, setLogs] = useState<ProvenanceLogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [projectId, filter]);

  async function fetchLogs() {
    try {
      let query = supabase
        .from("provenance_logs")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (filter) {
        query = query.eq("entity_type", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs((data || []) as ProvenanceLogType[]);
    } catch (error) {
      console.error("Error fetching provenance logs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "INSERT":
        return "text-emerald-500 bg-emerald-500/10";
      case "UPDATE":
        return "text-amber-500 bg-amber-500/10";
      case "DELETE":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "manga_panels":
        return "🎨";
      case "character_seeds":
        return "👤";
      case "director_choices":
        return "🎬";
      default:
        return "📄";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const entityTypes = [...new Set(logs.map((l) => l.entity_type))];

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-display font-bold">Provenance Log</h1>
              <p className="text-sm text-muted-foreground">
                Immutable audit trail for IP protection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filter || ""}
              onChange={(e) => setFilter(e.target.value || null)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{logs.length}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-500">
                {logs.filter((l) => l.action === "INSERT").length}
              </p>
              <p className="text-sm text-muted-foreground">Creations</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-500">
                {logs.filter((l) => l.action === "UPDATE").length}
              </p>
              <p className="text-sm text-muted-foreground">Director Choices</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📜 Your Provenance Deed</h3>
            <p className="text-sm text-muted-foreground">
              Every prompt, edit, and Director's Choice is logged here. This
              creates an immutable record proving human authorship—essential for
              streaming distribution and IP licensing. Export this log for legal
              documentation.
            </p>
          </CardContent>
        </Card>

        {/* Timeline */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No provenance logs yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create panels and make Director's Choices to build your audit
              trail
            </p>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-14">
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xs">
                    {getEntityIcon(log.entity_type)}
                  </div>

                  <Card variant="elevated">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getActionColor(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                          <span className="text-sm font-medium">
                            {log.entity_type.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(log.created_at)}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3 h-3" />
                          <span className="font-mono text-xs">
                            {log.entity_id.slice(0, 8)}...
                          </span>
                        </div>
                        {log.prompt_hash && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Prompt Hash:</span>
                            <span className="font-mono text-xs">
                              {log.prompt_hash}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Expandable details */}
                      {log.details && Object.keys(log.details).length > 0 && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-xs text-primary hover:underline">
                            View details
                          </summary>
                          <pre className="mt-2 p-2 bg-muted/30 rounded text-xs overflow-x-auto max-h-40">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Button */}
        {logs.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="heroOutline"
              onClick={() => {
                const blob = new Blob([JSON.stringify(logs, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `provenance-${projectId}.json`;
                a.click();
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export Provenance Deed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
