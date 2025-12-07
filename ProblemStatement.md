# Problem Statement: The "Black Box" of Job Applications

## 1. The Core Problem

### Pain Point
In today's competitive job market, qualified candidates are frequently rejected not because of a lack of skills, but because their resumes fail to pass automated **Applicant Tracking Systems (ATS)**. Job seekers often apply blindly, "spraying and praying," without understanding how well their profile matches a specific job description. This results in frustration, wasted time, and a lack of feedback on why they were rejected.

### Primary Users
*   **Active Job Seekers:** Individuals actively applying for roles who need to tailor their resumes for specific positions.
*   **Career Switchers:** Professionals trying to highlight transferrable skills relevant to a new industry.
*   **Students/Graduates:** New entrants to the workforce who are unfamiliar with ATS optimization keywords.

### Why It Matters
*   **For Candidates:** Increases the probability of securing an interview by ensuring their resume speaks the same language as the job description and the ATS.
*   **Efficiency:** detailed feedback allows users to iterate quickly rather than waiting weeks for a generic rejection email.
*   **Quality:** Encourages thoughtful, targeted applications rather than spamming generic resumes.

## 2. Project Scope

### In-Scope Features
*   **Resume Parsing:** Ability to upload and extract text from PDF and TXT resume files.
*   **Job Description Analysis:** A dedicated input area for users to paste full job descriptions.
*   **AI-Powered Matching:** Utilization of Google's Gemini API to semantically compare the resume against the job requirements.
*   **Scoring System:** A quantitative "Match Score" (0-100%) to give instant high-level feedback.
*   **Gap Analysis:** Identification of specific matching keywords and critical missing skills.
*   **Qualitative Insights:** Analysis of cultural fit, years of experience alignment, and specific recommendations for improvement.
*   **Privacy-First Design:** No database storage; files are processed in memory and analyzed stateless via the API.

### Out-of-Scope Features (Explicit)
*   **Resume Creation/Editing:** The tool does not provide a text editor to rewrite the resume; it only provides advice.
*   **Job Board/Search:** The tool does not search for jobs online; the user must provide the job description.
*   **Auto-Apply:** The tool will not submit applications to company portals on behalf of the user.
*   **User Accounts/History:** There is no login system or persistent history of past analyses.
*   **Career Coaching:** The AI provides feedback based on the text provided, not broad career counseling or human verification.
