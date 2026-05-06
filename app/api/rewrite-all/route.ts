import { NextRequest, NextResponse } from "next/server";
import { rewriteAllBullets } from "@/lib/ai-rewriter";
import type { ResumeData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { resume, targetKeywords, jobTitle }: {
      resume: ResumeData;
      targetKeywords: string[];
      jobTitle: string;
    } = await req.json();

    if (!resume || !targetKeywords?.length) {
      return NextResponse.json({ error: "resume and targetKeywords are required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Mock: prefix all bullets with a keyword
      const mock = structuredClone(resume) as ResumeData;
      for (const exp of mock.experience) {
        for (const bullet of exp.bullets) {
          const kw = targetKeywords[0] ?? "Advanced";
          bullet.rewritten = `${kw}: ${bullet.original}`;
          bullet.useRewritten = true;
        }
      }
      return NextResponse.json({ data: mock });
    }

    const updated = await rewriteAllBullets(resume, targetKeywords, jobTitle);
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("Rewrite all error:", err);
    return NextResponse.json({ error: "Failed to rewrite resume." }, { status: 500 });
  }
}
