import OpenAI from "openai";
import type { RewriteRequest, RewriteResponse, ATSScoreResult, ResumeData } from "./types";

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const REWRITE_SYSTEM = `You are an expert resume writer specializing in ATS optimization.
Your goal: rewrite resume bullet points to sound authoritative, use strong action verbs,
and naturally include target keywords — without sounding forced or keyword-stuffed.
Keep bullets concise (1-2 lines). Start with a strong action verb. Quantify where possible.
Return JSON only.`;

export async function rewriteBullet(req: RewriteRequest): Promise<RewriteResponse> {
  const { bullet, targetKeywords, jobTitle } = req;

  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 300,
    messages: [
      { role: "system", content: REWRITE_SYSTEM },
      {
        role: "user",
        content: `Rewrite this resume bullet point for a "${jobTitle}" role.
Naturally incorporate these keywords where relevant: ${targetKeywords.slice(0, 8).join(", ")}

Original bullet: "${bullet}"

Respond in JSON: { "rewritten": "...", "keywordsUsed": ["..."] }`,
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";
  try {
    return JSON.parse(raw);
  } catch {
    return { rewritten: bullet, keywordsUsed: [] };
  }
}

export async function rewriteAllBullets(
  resume: ResumeData,
  targetKeywords: string[],
  jobTitle: string
): Promise<ResumeData> {
  const updatedResume = structuredClone(resume);

  for (const exp of updatedResume.experience) {
    for (const bullet of exp.bullets) {
      try {
        const result = await rewriteBullet({
          bullet: bullet.original,
          targetKeywords,
          jobTitle,
        });
        bullet.rewritten = result.rewritten;
        bullet.useRewritten = true;
      } catch {
        // keep original on failure
      }
    }
  }

  return updatedResume;
}

export function calculateATSScore(resume: ResumeData, keywords: string[]): ATSScoreResult {
  if (!keywords.length) return { score: 0, matchedKeywords: [], missingKeywords: [], suggestions: [] };

  // Build full resume text (use rewritten bullets if toggled)
  const resumeText = buildResumeText(resume).toLowerCase();

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of keywords) {
    const normalized = kw.toLowerCase().trim();
    if (resumeText.includes(normalized)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const score = Math.round((matched.length / keywords.length) * 100);

  const suggestions: string[] = [];
  if (score < 40) suggestions.push("Use the AI Rewrite feature to add more relevant keywords.");
  if (missing.length > 5) suggestions.push(`Add these top missing skills: ${missing.slice(0, 3).join(", ")}.`);
  if (!resume.summary) suggestions.push("Add a professional summary to capture more keywords.");
  if (resume.skills.length < 5) suggestions.push("Expand your skills section with more relevant technologies.");

  return { score, matchedKeywords: matched, missingKeywords: missing, suggestions };
}

function buildResumeText(resume: ResumeData): string {
  const parts: string[] = [
    resume.summary,
    ...resume.skills,
    ...resume.experience.flatMap((e) => [
      e.title,
      e.company,
      ...e.bullets.map((b) => (b.useRewritten && b.rewritten ? b.rewritten : b.original)),
    ]),
    ...resume.education.flatMap((e) => [e.degree, e.field, e.institution]),
    ...resume.projects.flatMap((p) => [p.name, p.description, ...p.technologies]),
  ];
  return parts.filter(Boolean).join(" ");
}
