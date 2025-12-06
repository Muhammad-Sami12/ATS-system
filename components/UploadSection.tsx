import React, { useRef, useState, useCallback } from 'react';
import { Upload, FileText, X, Briefcase, AlertCircle } from 'lucide-react';
import { UploadedFile } from '../types';

interface UploadSectionProps {
  onAnalyze: (file: UploadedFile, jobDesc: string) => void;
  isAnalyzing: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    setError(null);
    
    // Validate file size (Max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file type
    if (selectedFile.type !== 'application/pdf' && selectedFile.type !== 'text/plain') {
      setError('Only PDF and TXT files are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setFile({
        name: selectedFile.name,
        type: selectedFile.type,
        content: base64String
      });
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = () => {
    if (!file) {
      setError('Please upload a resume.');
      return;
    }
    if (!jobDescription.trim() || jobDescription.length < 50) {
      setError('Please enter a valid job description (min 50 chars).');
      return;
    }
    setError(null);
    onAnalyze(file, jobDescription);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Left: Resume Upload */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="bg-blue-100 p-1.5 rounded-md">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">1. Upload Resume</h2>
        </div>
        
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all h-64 cursor-pointer relative
            ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : file ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50'}
          `}
        >
          {!file ? (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-blue-200' : 'bg-blue-100'}`}>
                <FileText className={`w-8 h-8 ${isDragging ? 'text-blue-700' : 'text-blue-600'}`} />
              </div>
              <p className="text-slate-600 font-medium mb-2">
                {isDragging ? "Drop file here" : "Click or drag to upload resume"}
              </p>
              <p className="text-slate-400 text-sm mb-4">PDF or TXT (Max 5MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="resume-upload"
              />
            </>
          ) : (
            <div className="w-full flex flex-col items-center animate-fadeIn z-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-800 font-semibold text-lg truncate max-w-xs">{file.name}</p>
              <p className="text-slate-500 text-sm mb-6">Ready for analysis</p>
              <button 
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="flex items-center space-x-1 text-red-500 hover:text-red-700 font-medium transition-colors bg-white px-3 py-1.5 rounded-full border border-red-100 shadow-sm hover:shadow"
              >
                <X className="w-4 h-4" />
                <span>Remove File</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Job Description */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 mb-2">
           <div className="bg-purple-100 p-1.5 rounded-md">
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">2. Job Description</h2>
        </div>

        <div className="relative h-64">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here (responsibilities, requirements, skills)..."
            className="w-full h-full p-4 rounded-xl border border-slate-700 bg-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-slate-100 placeholder-slate-400 text-sm leading-relaxed shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Action Area */}
      <div className="lg:col-span-2 flex flex-col items-center space-y-4 mt-4">
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-pulse">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={isAnalyzing || !file || !jobDescription}
          className={`
            w-full md:w-auto md:min-w-[300px] py-4 px-8 rounded-full font-bold text-lg shadow-lg transform transition-all duration-200
            ${isAnalyzing || !file || !jobDescription 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:-translate-y-1 active:scale-95'}
          `}
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing with Gemini...</span>
            </div>
          ) : (
            "Analyze Match"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;