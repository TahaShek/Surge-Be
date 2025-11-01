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
}

export default new AIService();
