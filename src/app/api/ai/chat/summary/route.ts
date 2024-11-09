import { NextResponse } from "next/server";
import { getTogetherClient } from "@/lib/together";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const together = getTogetherClient();
    const { conversationId } = await request.json();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Generate summary using Llama
    const summary = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "Create a concise summary of this construction-related conversation, highlighting key points and decisions."
        },
        {
          role: "user",
          content: JSON.stringify(conversation.messages)
        }
      ],
      response_format: { type: "json_object" }
    });

    const summaryResult = JSON.parse(summary.choices[0]?.message?.content || "{}");

    // Update conversation with summary
    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        summary: summaryResult.summary,
        tags: summaryResult.tags,
        updated_at: new Date().toISOString()
      })
      .eq("id", conversationId);

    if (updateError) throw updateError;

    return NextResponse.json(summaryResult);
  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate conversation summary" },
      { status: 500 }
    );
  }
}
