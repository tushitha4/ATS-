import type { ResumeData } from "./types";

// We'll use a simple ID generator to avoid uuid dependency issues
let counter = 1;
const uid = () => `id-${counter++}-${Math.random().toString(36).slice(2, 7)}`;

export const DEFAULT_RESUME: ResumeData = {
  contact: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    website: "alexjohnson.dev",
  },
  summary:
    "Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and delivering exceptional user experiences.",
  experience: [
    {
      id: uid(),
      company: "TechCorp Inc.",
      title: "Senior Software Engineer",
      startDate: "Jan 2022",
      endDate: "",
      current: true,
      bullets: [
        {
          id: uid(),
          original: "Built and maintained React-based frontend applications serving 500k+ users",
          useRewritten: false,
        },
        {
          id: uid(),
          original: "Improved API response times by 40% through caching and query optimization",
          useRewritten: false,
        },
        {
          id: uid(),
          original: "Led a team of 4 engineers on a critical payment integration project",
          useRewritten: false,
        },
      ],
    },
    {
      id: uid(),
      company: "StartupXYZ",
      title: "Full Stack Developer",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      current: false,
      bullets: [
        {
          id: uid(),
          original: "Developed Node.js microservices handling 1M+ daily transactions",
          useRewritten: false,
        },
        {
          id: uid(),
          original: "Designed and implemented RESTful APIs consumed by mobile and web clients",
          useRewritten: false,
        },
      ],
    },
  ],
  education: [
    {
      id: uid(),
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "May 2019",
      gpa: "3.8",
    },
  ],
  skills: [
    "React", "TypeScript", "Node.js", "Python", "PostgreSQL",
    "AWS", "Docker", "GraphQL", "REST APIs", "Git",
  ],
  projects: [
    {
      id: uid(),
      name: "OpenSource Dashboard",
      description: "A real-time analytics dashboard built with React and WebSockets",
      technologies: ["React", "WebSockets", "D3.js", "Express"],
      url: "github.com/alexjohnson/dashboard",
    },
  ],
  template: "modern",
};

export const SAMPLE_JD = `Senior Software Engineer - Full Stack
Acme Technologies | San Francisco, CA

We are looking for a Senior Software Engineer to join our growing team.

Requirements:
- 5+ years of experience with React and TypeScript
- Strong proficiency in Node.js and Python
- Experience with cloud platforms (AWS, GCP, or Azure)
- Knowledge of microservices architecture and Docker/Kubernetes
- Excellent problem-solving and communication skills
- Experience with Agile/Scrum methodologies
- PostgreSQL or MongoDB database experience
- CI/CD pipeline experience

Nice to have:
- GraphQL experience
- Leadership experience managing junior engineers
- Open source contributions`;
