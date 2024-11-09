// src/app/api/ai/insights/route.ts
import { NextResponse } from "next/server";
import { getTogetherClient } from "@/lib/together";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const together = getTogetherClient();
    const { projectId, data, type } = await request.json();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get project context
    const { data: projectData } = await supabase
      .from("projects")
      .select(`
        *,
        analyses:project_analyses(*),
        timeline:project_timelines(*),
        documents:documents(*)
      `)
      .eq("id", projectId)
      .single();

    // Generate insights using Llama
    const insights = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "Generate construction project insights based on the provided data and context."
        },
        {
          role: "user",
          content: JSON.stringify({
            type,
            projectContext: projectData,
            analysisData: data
          })
        }
      ],
      response_format: { type: "json_object" }
    });

    const insightResults = JSON.parse(insights.choices[0]?.message?.content || "{}");

    // Store insights in the database
    const { error: dbError } = await supabase
      .from("project_insights")
      .insert({
        project_id: projectId,
        insight_type: type,
        insights: insightResults,
        creator_id: user.id,
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    return NextResponse.json(insightResults);
  } catch (error) {
    console.error("Insight generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");

    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Start building the query
    const query = supabase
      .from("project_insights")
      .select("*")
      .order("created_at", { ascending: false });

    // Handle "all" projectId or validate UUID format
    if (projectId && projectId !== "all") {
      // Ensure projectId is in UUID format if not "all"
      if (!/^[0-9a-fA-F-]{36}$/.test(projectId)) {
        return NextResponse.json({ error: "Invalid projectId format" }, { status: 400 });
      }
      query.eq("project_id", projectId);
    }

    // Filter by insight type if provided
    if (type) {
      query.eq("insight_type", type);
    }

    // Execute the query to fetch insights
    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
