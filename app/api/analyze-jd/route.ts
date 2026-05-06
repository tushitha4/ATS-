import { NextRequest, NextResponse } from "next/server";
import { analyzeJobDescription } from "@/lib/jd-analyzer";

export async function POST(req: NextRequest) {
  try {
    const { jobDescription } = await req.json();

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: "Job description must be at least 50 characters." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return mock data when API key not configured
      return NextResponse.json({
        data: {
          jobTitle: "Software Engineer",
          company: "Demo Company",
          hardSkills: [
            { keyword: "React", category: "hard_skill", frequency: 3, importance: "high" },
            { keyword: "TypeScript", category: "hard_skill", frequency: 2, importance: "high" },
            { keyword: "Node.js", category: "hard_skill", frequency: 2, importance: "medium" },
            { keyword: "Python", category: "hard_skill", frequency: 1, importance: "medium" },
          ],
          softSkills: [
            { keyword: "Leadership", category: "soft_skill", frequency: 2, importance: "high" },
            { keyword: "Communication", category: "soft_skill", frequency: 1, importance: "medium" },
          ],
          tools: [
            { keyword: "Docker", category: "tool", frequency: 2, importance: "high" },
            { keyword: "AWS", category: "tool", frequency: 2, importance: "medium" },
            { keyword: "PostgreSQL", category: "tool", frequency: 1, importance: "medium" },
          ],
          qualifications: [
            { keyword: "5+ years experience", category: "qualification", frequency: 1, importance: "high" },
            { keyword: "Bachelor's degree", category: "qualification", frequency: 1, importance: "medium" },
          ],
          allKeywords: [],
        },
      });
    }

    const result = await analyzeJobDescription(jobDescription);
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("JD analysis error:", err);
    return NextResponse.json({ error: "Failed to analyze job description." }, { status: 500 });
  }
}
