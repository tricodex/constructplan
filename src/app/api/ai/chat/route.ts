import { NextResponse } from "next/server";
import { getTogetherClient } from "@/lib/together";
import { createClient } from "@/lib/supabase/server";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const together = getTogetherClient();
    const { message, projectId, context } = await request.json();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get project context if needed
    let projectContext = "";
    if (projectId) {
      const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      
      if (project) {
        projectContext = `Project Context: ${project.name} - ${project.description}`;
      }
    }

    // Prepare messages array with proper typing
    const messages: Message[] = [
      {
        role: "system",
        content: "You are a knowledgeable construction assistant. Provide clear, practical advice based on construction best practices."
      }
    ];

    if (projectContext) {
      messages.push({
        role: "user",
        content: projectContext
      });
    }

    if (context) {
      messages.push({
        role: "user",
        content: context
      });
    }

    messages.push({
      role: "user",
      content: message
    });

    // Generate response using Together AI
    const completion = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      messages
    });

    const response = completion.choices[0]?.message?.content;

    // Store conversation
    const { error: dbError } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        project_id: projectId,
        messages: [
          {
            role: "user",
            content: message,
            timestamp: new Date().toISOString()
          },
          {
            role: "assistant",
            content: response,
            timestamp: new Date().toISOString()
          }
        ],
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}