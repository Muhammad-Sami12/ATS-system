import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/ResultsDashboard';
import { AnalysisResult, UploadedFile } from './types';
import { analyzeJobFit } from './services/geminiService';
import { AlertTriangle, X } from 'lucide-react';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Theme state initialization
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAnalyze = async (file: UploadedFile, jobDescription: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzeJobFit(file.content, file.type, jobDescription);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-200">
      <Header isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-start justify-between animate-fadeIn transition-colors">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Hero Section (Only show if no results yet) */}
        {!result && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">
              Is your resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">match-ready?</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
              Stop guessing. Use our AI-powered ATS simulator to parse your resume against job descriptions 
              and get instant, actionable feedback to increase your interview chances.
            </p>
          </div>
        )}

        {/* Input Section */}
        <UploadSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Results Section */}
        {result && (
          <div id="results">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Analysis Report</h2>
                <button 
                  onClick={() => { setResult(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Start New Analysis
                </button>
             </div>
             <ResultsDashboard result={result} />
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} MatchPro AI. Powered by Google Gemini.</p>
          <p className="mt-2 text-xs">This tool uploads data to Gemini for processing. Do not upload sensitive PII.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;