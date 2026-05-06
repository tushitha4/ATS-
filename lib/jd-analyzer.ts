import OpenAI from "openai";
import type { JDAnalysisResult, ExtractedKeyword } from "./types";

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst and recruiter.
Your job is to analyze job descriptions and extract the most important keywords,
skills, and qualifications that ATS systems and recruiters look for.

Always respond with valid JSON only — no markdown, no explanation.`;

export async function analyzeJobDescription(jd: string): Promise<JDAnalysisResult> {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Analyze this job description and extract keywords. Return JSON in exactly this format:
{
  "jobTitle": "string",
  "company": "string or null",
  "hardSkills": [{ "keyword": "string", "category": "hard_skill", "frequency": number, "importance": "high|medium|low" }],
  "softSkills": [{ "keyword": "string", "category": "soft_skill", "frequency": number, "importance": "high|medium|low" }],
  "tools": [{ "keyword": "string", "category": "tool", "frequency": number, "importance": "high|medium|low" }],
  "qualifications": [{ "keyword": "string", "category": "qualification", "frequency": number, "importance": "high|medium|low" }]
}

Job Description:
${jd}`,
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";

  let parsed: Omit<JDAnalysisResult, "allKeywords">;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse JD analysis response");
  }

  const allKeywords: ExtractedKeyword[] = [
    ...(parsed.hardSkills ?? []),
    ...(parsed.softSkills ?? []),
    ...(parsed.tools ?? []),
    ...(parsed.qualifications ?? []),
  ].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.importance] - order[b.importance];
  });

  return { ...parsed, allKeywords };
}
