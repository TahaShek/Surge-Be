import { BaseDocument, Ref } from "./common";
import { IUser } from "./user.types";

// Talent Seeker (Job Seeker/Candidate) - Applies to jobs
export interface ITalentSeeker extends BaseDocument {
  userId: Ref<IUser>;
  title?: string; // e.g., "Full Stack Developer"
  bio?: string;
  skills: string[];
  experience?: number; // years of experience
  education?: {
    degree: string;
    institution: string;
    year?: number;
  }[];
  portfolio?: string; // URL to portfolio
  github?: string;
  linkedin?: string;
  resume?: string; // URL to resume file
  availability?: "available" | "not-available" | "open-to-offers";
  expectedSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  location?: string;
  isOpenToRemote?: boolean;
  preferredJobTypes?: ("full-time" | "part-time" | "contract" | "freelance")[];
}

export interface TalentSeekerDocument extends ITalentSeeker {}

export interface TalentSeekerModelType {
  // Add custom static methods here if needed
}
