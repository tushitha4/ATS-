// ─── Resume Schema ──────────────────────────────────────────────
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: BulletPoint[];
}

export interface BulletPoint {
  id: string;
  original: string;
  rewritten?: string;
  useRewritten: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  template: ResumeTemplate;
}

export type ResumeTemplate = "classic" | "modern" | "creative";

// ─── JD Analysis ────────────────────────────────────────────────
export interface ExtractedKeyword {
  keyword: string;
  category: "hard_skill" | "soft_skill" | "tool" | "qualification";
  frequency: number;
  importance: "high" | "medium" | "low";
}

export interface JDAnalysisResult {
  jobTitle: string;
  company?: string;
  hardSkills: ExtractedKeyword[];
  softSkills: ExtractedKeyword[];
  tools: ExtractedKeyword[];
  qualifications: ExtractedKeyword[];
  allKeywords: ExtractedKeyword[];
}

// ─── ATS Scoring ────────────────────────────────────────────────
export interface ATSScoreResult {
  score: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

// ─── AI Rewrite ─────────────────────────────────────────────────
export interface RewriteRequest {
  bullet: string;
  targetKeywords: string[];
  jobTitle: string;
}

export interface RewriteResponse {
  rewritten: string;
  keywordsUsed: string[];
}

// ─── User / Subscription ────────────────────────────────────────
export type SubscriptionTier = "free" | "pro";

export interface UserProfile {
  id: string;
  email: string;
  tier: SubscriptionTier;
  resumeCount: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

// ─── API Responses ──────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
