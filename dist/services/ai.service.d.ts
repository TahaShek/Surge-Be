declare class AIService {
    private genAI?;
    private model;
    constructor();
    /**
     * Generate personalized career advice based on match details
     */
    generateMatchInsights(matchData: {
        matchPercentage: number;
        matchLevel: string;
        matchDetails: any;
        jobTitle: string;
        talentSeekerSkills: string[];
    }): Promise<string[]>;
    /**
     * Generate personalized job recommendations summary
     */
    generateRecommendationSummary(data: {
        totalJobs: number;
        topSkills: string[];
        avgMatchScore: number;
        talentSeekerProfile: any;
    }): Promise<string>;
    /**
     * Fallback insights when AI is unavailable
     */
    private getFallbackInsights;
    /**
     * Fallback summary when AI is unavailable
     */
    private getFallbackSummary;
    /**
     * CREATIVE FEATURE 1: Enhance job description with AI
     */
    enhanceJobDescription(jobData: {
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
        salaryRangeEstimate?: {
            min: number;
            max: number;
            currency: string;
        };
        improvements: string[];
    }>;
    /**
     * CREATIVE FEATURE 2: Analyze cover letter quality
     */
    analyzeCoverLetter(coverLetterData: {
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
    }>;
    /**
     * CREATIVE FEATURE 3: Generate interview questions
     */
    generateInterviewQuestions(questionData: {
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
    }>;
    private getFallbackJobEnhancement;
    private getFallbackCoverLetterAnalysis;
    private getFallbackInterviewQuestions;
}
declare const _default: AIService;
export default _default;
//# sourceMappingURL=ai.service.d.ts.map