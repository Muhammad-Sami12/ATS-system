import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeJobFit = async (
  resumeBase64: string,
  resumeMimeType: string,
  jobDescription: string
): Promise<AnalysisResult> => {
  const ai = getClient();
  
  const systemInstruction = `
    You are MatchPro, an expert Applicant Tracking System (ATS) and Senior Technical Recruiter.
    Your goal is to objectively evaluate a candidate's resume against a specific job description.
    Provide a strict but fair match score, identify key skill gaps, and offer actionable advice.
    Focus on keywords, experience levels, and technical requirements.
  `;

  const prompt = `
    Please analyze the attached resume against the following job description:
    
    JOB DESCRIPTION:
    ${jobDescription}

    Provide the output in strict JSON format containing:
    - matchScore (number 0-100)
    - summary (brief 2-3 sentence overview of the fit)
    - matchingSkills (array of strings)
    - missingSkills (array of strings, critical keywords missing from resume)
    - culturalFit (string description of potential soft skill/culture alignement)
    - recommendations (array of strings, specific actionable improvements for the resume)
    - yearsExperienceMatch (string, e.g., "Candidate has 3 years, Role requires 5+")
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: resumeMimeType,
              data: resumeBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            matchingSkills: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            missingSkills: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            culturalFit: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            yearsExperienceMatch: { type: Type.STRING }
          },
          required: [
            "matchScore", 
            "summary", 
            "matchingSkills", 
            "missingSkills", 
            "culturalFit", 
            "recommendations", 
            "yearsExperienceMatch"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }
    
    // Clean potential markdown formatting (```json ... ```)
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    
    return JSON.parse(cleanedText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
};