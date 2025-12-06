import React from 'react';
import { Briefcase, FileSearch } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileSearch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">MatchPro AI</h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">ATS Optimization & Job Fit Prediction</p>
          </div>
        </div>
        
        <nav className="flex items-center space-x-4">
          <a 
            href="https://github.com/MuhammadUmerKhan/MatchPro-Resume-Parsing-Job-Fit-Prediction" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            GitHub Source
          </a>
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
            Gemini 2.5 Flash
          </span>
        </nav>
      </div>
    </header>
  );
};

export default Header;