import { NextRequest, NextResponse } from "next/server";
import { calculateATSScore } from "@/lib/ai-rewriter";
import type { ResumeData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { resume, keywords }: { resume: ResumeData; keywords: string[] } = await req.json();

    if (!resume || !keywords) {
      return NextResponse.json({ error: "resume and keywords are required" }, { status: 400 });
    }

    const result = calculateATSScore(resume, keywords);
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("ATS score error:", err);
    return NextResponse.json({ error: "Failed to calculate ATS score." }, { status: 500 });
  }
}
