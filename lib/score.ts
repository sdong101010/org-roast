import { Finding } from "./analyzers/types";

export interface OrgGrade {
  score: number;
  letter: "A" | "B" | "C" | "D" | "F";
  label: string;
}

const GRADE_MAP: { min: number; letter: OrgGrade["letter"]; label: string }[] = [
  { min: 90, letter: "A", label: "Certified clean" },
  { min: 75, letter: "B", label: "Not bad, but not great" },
  { min: 60, letter: "C", label: "Your org needs therapy" },
  { min: 40, letter: "D", label: "This is a cry for help" },
  { min: 0, letter: "F", label: "Absolute dumpster fire" },
];

export function calculateScore(findings: Finding[]): OrgGrade {
  let score = 100;

  for (const f of findings) {
    score -= f.severity * 5;
  }

  score = Math.max(0, Math.min(100, score));

  const grade = GRADE_MAP.find((g) => score >= g.min) || GRADE_MAP[GRADE_MAP.length - 1];

  return {
    score,
    letter: grade.letter,
    label: grade.label,
  };
}
