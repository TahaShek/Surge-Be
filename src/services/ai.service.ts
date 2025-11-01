import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env";
import logger from "../config/logger";

class AIService {
  private genAI?: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!config.GEMINI.api_key) {
      logger.warn("Gemini API key not configured. AI features will be disabled.");
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(config.GEMINI.api_key);
    // Use Gemini 1.5 Flash for speed
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Generate personalized career advice based on match details
   */
  async generateMatchInsights(matchData: {
    matchPercentage: number;
    matchLevel: string;
    matchDetails: any;
    jobTitle: string;
    talentSeekerSkills: string[];
  }): Promise<string[]> {
    if (!this.model) {
      return this.getFallbackInsights(matchData);
    }

    try {
      const prompt = `You are a career advisor. Provide 3 concise, actionable insights (max 15 words each) for this job match:

Job: ${matchData.jobTitle}
Match: ${matchData.matchPercentage}% (${matchData.matchLevel})
Skills Match: ${matchData.matchDetails.skillsMatch}%
Experience Match: ${matchData.matchDetails.experienceMatch}%
Location Match: ${matchData.matchDetails.locationMatch}%

Matching Skills: ${matchData.matchDetails.matchingSkills?.join(", ") || "None"}
Missing Skills: ${matchData.matchDetails.missingSkills?.join(", ") || "None"}

Return ONLY 3 bullet points, each starting with an emoji. Be specific and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response into array
      const insights = text
        .split("\n")
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 3);

      return insights.length > 0 ? insights : this.getFallbackInsights(matchData);
    } catch (error) {
      logger.error("AI service error:", error);
      return this.getFallbackInsights(matchData);
    }
  }

  /**
   * Generate personalized job recommendations summary
   */
  async generateRecommendationSummary(data: {
    totalJobs: number;
    topSkills: string[];
    avgMatchScore: number;
    talentSeekerProfile: any;
  }): Promise<string> {
    if (!this.model) {
      return this.getFallbackSummary(data);
    }

    try {
      const prompt = `You are a career advisor. Write a 2-sentence personalized summary (max 30 words total) for this job seeker:

Found ${data.totalJobs} jobs
Average match: ${data.avgMatchScore}%
Top skills in demand: ${data.topSkills.join(", ")}
Job seeker skills: ${data.talentSeekerProfile.skills?.join(", ") || "Not specified"}
Experience: ${data.talentSeekerProfile.experience || 0} years
Preferred types: ${data.talentSeekerProfile.preferredJobTypes?.join(", ") || "Any"}

Be encouraging and specific. Mention skill matches and opportunities.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      return text || this.getFallbackSummary(data);
    } catch (error) {
      logger.error("AI service error:", error);
      return this.getFallbackSummary(data);
    }
  }

  /**
   * Fallback insights when AI is unavailable
   */
  private getFallbackInsights(matchData: any): string[] {
    const insights: string[] = [];

    if (matchData.matchPercentage >= 80) {
      insights.push("🎉 Excellent match! This role aligns perfectly with your profile.");
    } else if (matchData.matchPercentage >= 65) {
      insights.push("✅ Good match! You meet most of the key requirements.");
    } else {
      insights.push("📊 Fair match. Consider highlighting relevant transferable skills.");
    }

    if (matchData.matchDetails.skillsMatch >= 70) {
      insights.push("💪 Your skills are a strong match for this position!");
    } else if (matchData.matchDetails.missingSkills?.length > 0) {
      insights.push(
        `📚 Consider learning: ${matchData.matchDetails.missingSkills.slice(0, 2).join(", ")}`
      );
    }

    if (matchData.matchDetails.experienceMatch >= 80) {
      insights.push("⭐ Your experience level is ideal for this role.");
    } else if (matchData.matchDetails.experienceMatch < 60) {
      insights.push("💼 Gaining more experience could strengthen your application.");
    }

    return insights.slice(0, 3);
  }

  /**
   * Fallback summary when AI is unavailable
   */
  private getFallbackSummary(data: any): string {
    if (data.totalJobs === 0) {
      return "No jobs match your current profile. Consider expanding your skill set or adjusting preferences.";
    }

    if (data.avgMatchScore >= 75) {
      return `Great news! We found ${data.totalJobs} highly relevant opportunities matching your skills. Your profile is in high demand.`;
    } else if (data.avgMatchScore >= 60) {
      return `We found ${data.totalJobs} potential matches for you. Consider highlighting your ${data.topSkills[0] || "key"} skills to stand out.`;
    } else {
      return `We found ${data.totalJobs} jobs that could be a fit. Upskilling in ${data.topSkills.slice(0, 2).join(" and ")} could improve your matches.`;
    }
  }

  /**
   * CREATIVE FEATURE 1: Enhance job description with AI
   */
  async enhanceJobDescription(jobData: {
    title: string;
    description: string;
    skills: string[];
    jobType: string;
    experienceLevel: string;
    location?: string;
    responsibilities?: string;
    requirements?: string;
  }): Promise<{
    enhancedTitle?: string;
    enhancedDescription?: string;
    suggestedSkills: string[];
    suggestedResponsibilities?: string;
    suggestedRequirements?: string;
    salaryRangeEstimate?: { min: number; max: number; currency: string };
    improvements: string[];
  }> {
    if (!this.model) {
      return this.getFallbackJobEnhancement(jobData);
    }

    try {
      const prompt = `You are an expert job posting optimizer. Analyze this job posting and provide enhancements:

Job Title: ${jobData.title}
Description: ${jobData.description}
Current Skills: ${jobData.skills.join(", ") || "None listed"}
Job Type: ${jobData.jobType}
Experience Level: ${jobData.experienceLevel}
Location: ${jobData.location || "Not specified"}

Provide a JSON response with:
1. enhancedTitle: A more compelling job title (if current one can be improved)
2. enhancedDescription: Rewrite description to be more engaging and clear (2-3 paragraphs)
3. suggestedSkills: Array of 5-8 relevant skills (include current + add missing important ones)
4. suggestedResponsibilities: 5-7 bullet points of key responsibilities (if not provided: ${!jobData.responsibilities})
5. suggestedRequirements: 5-7 bullet points of requirements (if not provided: ${!jobData.requirements})
6. salaryRangeEstimate: Estimate salary range based on role, experience, location in USD
7. improvements: Array of 3-4 specific suggestions to improve the posting

Return ONLY valid JSON, no markdown formatting.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      const enhancement = JSON.parse(jsonText);

      return {
        enhancedTitle: enhancement.enhancedTitle || undefined,
        enhancedDescription: enhancement.enhancedDescription || undefined,
        suggestedSkills: enhancement.suggestedSkills || jobData.skills,
        suggestedResponsibilities: enhancement.suggestedResponsibilities || undefined,
        suggestedRequirements: enhancement.suggestedRequirements || undefined,
        salaryRangeEstimate: enhancement.salaryRangeEstimate || undefined,
        improvements: enhancement.improvements || [],
      };
    } catch (error) {
      logger.error("AI job enhancement error:", error);
      return this.getFallbackJobEnhancement(jobData);
    }
  }

  /**
   * CREATIVE FEATURE 2: Analyze cover letter quality
   */
  async analyzeCoverLetter(coverLetterData: {
    coverLetter: string;
    jobTitle: string;
    jobDescription: string;
    candidateSkills: string[];
  }): Promise<{
    score: number;
    isPersonalized: boolean;
    enthusiasmLevel: "high" | "medium" | "low";
    strengths: string[];
    weaknesses: string[];
    redFlags: string[];
    overallFeedback: string;
    suggestions: string[];
  }> {
    if (!this.model) {
      return this.getFallbackCoverLetterAnalysis(coverLetterData);
    }

    try {
      const prompt = `You are a recruitment expert. Analyze this cover letter for a job application:

Job Title: ${coverLetterData.jobTitle}
Job Description: ${coverLetterData.jobDescription.substring(0, 500)}
Candidate Skills: ${coverLetterData.candidateSkills.join(", ")}

Cover Letter:
${coverLetterData.coverLetter}

Provide a JSON response with:
1. score: Overall quality score 0-100
2. isPersonalized: true if tailored to this specific job, false if generic
3. enthusiasmLevel: "high", "medium", or "low"
4. strengths: Array of 2-3 positive aspects
5. weaknesses: Array of 2-3 areas for improvement
6. redFlags: Array of serious issues (typos, irrelevant content, negativity)
7. overallFeedback: 2-sentence summary
8. suggestions: Array of 2-3 specific actionable improvements

Return ONLY valid JSON, no markdown formatting.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      const analysis = JSON.parse(jsonText);

      return {
        score: Math.min(100, Math.max(0, analysis.score || 50)),
        isPersonalized: analysis.isPersonalized ?? true,
        enthusiasmLevel: analysis.enthusiasmLevel || "medium",
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        redFlags: analysis.redFlags || [],
        overallFeedback: analysis.overallFeedback || "Cover letter analyzed successfully.",
        suggestions: analysis.suggestions || [],
      };
    } catch (error) {
      logger.error("AI cover letter analysis error:", error);
      return this.getFallbackCoverLetterAnalysis(coverLetterData);
    }
  }

  /**
   * CREATIVE FEATURE 3: Generate interview questions
   */
  async generateInterviewQuestions(questionData: {
    jobTitle: string;
    jobDescription: string;
    requiredSkills: string[];
    experienceLevel: string;
    candidateSkills: string[];
    candidateExperience: number;
  }): Promise<{
    technicalQuestions: string[];
    behavioralQuestions: string[];
    situationalQuestions: string[];
    skillGapQuestions: string[];
    cultureQuestions: string[];
  }> {
    if (!this.model) {
      return this.getFallbackInterviewQuestions(questionData);
    }

    try {
      const prompt = `You are an expert interviewer. Generate interview questions for this candidate:

Job Title: ${questionData.jobTitle}
Experience Level: ${questionData.experienceLevel}
Required Skills: ${questionData.requiredSkills.join(", ")}
Candidate Skills: ${questionData.candidateSkills.join(", ")}
Candidate Experience: ${questionData.candidateExperience} years

Provide a JSON response with:
1. technicalQuestions: 5 technical questions based on required skills
2. behavioralQuestions: 4 behavioral questions relevant to the role
3. situationalQuestions: 3 scenario-based questions
4. skillGapQuestions: 2-3 questions about skills they lack but are required
5. cultureQuestions: 3 questions about work style and team fit

Make questions specific, insightful, and actionable. Return ONLY valid JSON, no markdown.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      const questions = JSON.parse(jsonText);

      return {
        technicalQuestions: questions.technicalQuestions || [],
        behavioralQuestions: questions.behavioralQuestions || [],
        situationalQuestions: questions.situationalQuestions || [],
        skillGapQuestions: questions.skillGapQuestions || [],
        cultureQuestions: questions.cultureQuestions || [],
      };
    } catch (error) {
      logger.error("AI interview questions error:", error);
      return this.getFallbackInterviewQuestions(questionData);
    }
  }

  // Fallback methods
  private getFallbackJobEnhancement(jobData: any) {
    return {
      suggestedSkills: jobData.skills,
      improvements: [
        "Consider adding specific technologies and tools",
        "Highlight company culture and benefits",
        "Include clear career growth opportunities",
      ],
    };
  }

  private getFallbackCoverLetterAnalysis(data: any) {
    const wordCount = data.coverLetter.split(" ").length;
    const hasJobTitle = data.coverLetter.toLowerCase().includes(data.jobTitle.toLowerCase());

    return {
      score: wordCount > 100 && hasJobTitle ? 70 : 50,
      isPersonalized: hasJobTitle,
      enthusiasmLevel: "medium" as const,
      strengths: ["Adequate length", "Professional tone"],
      weaknesses: ["Could be more specific to the role"],
      redFlags: [],
      overallFeedback: "Cover letter meets basic requirements.",
      suggestions: ["Add specific examples", "Mention company research"],
    };
  }

  private getFallbackInterviewQuestions(data: any) {
    return {
      technicalQuestions: [
        `Can you describe your experience with ${data.requiredSkills[0] || "the required technologies"}?`,
        `Walk me through a challenging project involving ${data.requiredSkills[1] || "your key skills"}.`,
        "How do you stay updated with industry trends?",
      ],
      behavioralQuestions: [
        "Tell me about a time you faced a difficult challenge at work.",
        "Describe a situation where you had to work with a difficult team member.",
      ],
      situationalQuestions: [
        "How would you approach learning a new technology quickly?",
      ],
      skillGapQuestions: [],
      cultureQuestions: [
        "What type of work environment helps you thrive?",
      ],
    };
  }
}

export default new AIService();
