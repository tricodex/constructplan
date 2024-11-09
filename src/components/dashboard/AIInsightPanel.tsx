"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
// import type { Database } from "@/lib/supabase/database.types";
import { useToast } from "@/hooks/use-toast";

// type ProjectAnalysis = Database['public']['Tables']['project_analysis']['Row'];
type AnalysisType = "photo" | "timeline" | "resource" | "risk" | "quality" | "cost" | "overview" | "other" | "portfolio" | "progress";

interface AIInsightPanelProps {
  projectId: string;
  analysisType: AnalysisType;
}

interface AnalysisResult {
  recommendations: string[];
  confidence_score: number;
  identified_issues: string[];
  safety_concerns: string[];
  progress_percentage?: number;
}

export const AIInsightPanel = ({ projectId, analysisType }: AIInsightPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInsights = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `/api/ai/insights?projectId=${projectId}&type=${analysisType}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setInsights(data);
      } catch (error) {
        console.error("Error fetching insights:", error);
        toast({
          title: "Error",
          description: "Failed to fetch insights. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [projectId, analysisType, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          AI Insights
          <Badge variant="outline">{analysisType}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : insights?.recommendations ? (
          insights.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
              <p className="text-sm text-muted-foreground">{recommendation}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No insights available.</p>
        )}
      </CardContent>
    </Card>
  );
};