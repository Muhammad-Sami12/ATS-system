export interface AnalysisResult {
  matchScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  culturalFit: string;
  recommendations: string[];
  yearsExperienceMatch: string;
}

export enum FileType {
  PDF = 'application/pdf',
  TXT = 'text/plain',
  UNKNOWN = 'unknown'
}

export interface UploadedFile {
  name: string;
  type: string;
  content: string; // Base64 or text content
}
