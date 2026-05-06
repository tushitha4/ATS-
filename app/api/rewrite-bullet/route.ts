import { NextRequest, NextResponse } from "next/server";
import { rewriteBullet } from "@/lib/ai-rewriter";

export async function POST(req: NextRequest) {
  try {
    const { bullet, targetKeywords, jobTitle } = await req.json();

    if (!bullet) {
      return NextResponse.json({ error: "bullet is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Mock rewrite for demo
      const kw = targetKeywords?.slice(0, 2).join(" and ") || "relevant skills";
      return NextResponse.json({
        data: {
          rewritten: `Leveraged ${kw} to ${bullet.toLowerCase().replace(/^[A-Z]/, (c: string) => c.toLowerCase())}`,
          keywordsUsed: targetKeywords?.slice(0, 2) ?? [],
        },
      });
    }

    const result = await rewriteBullet({ bullet, targetKeywords, jobTitle });
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("Rewrite error:", err);
    return NextResponse.json({ error: "Failed to rewrite bullet." }, { status: 500 });
  }
}
