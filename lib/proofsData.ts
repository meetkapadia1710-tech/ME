export interface ProofItem {
  id: string;
  name: string;
  url: string;
  categories: string[];
  value?: number;
  suffix?: string;
}

export const PROOFS: ProofItem[] = [
  {
    id: "aws-cert",
    name: "AWS Solutions Architect",
    url: "https://aws.amazon.com",
    categories: ["Systems", "Backend"],
  },
  {
    id: "nextjs-spec",
    name: "Next.js Architecture Proof",
    url: "https://nextjs.org",
    categories: ["Frontend", "Systems"],
  },
];
