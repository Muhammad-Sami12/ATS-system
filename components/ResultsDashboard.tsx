import React from 'react';
import { AnalysisResult } from '../types';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle2, XCircle, Lightbulb, TrendingUp, UserCheck, Briefcase } from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const scoreData = [{
    name: 'Match',
    value: result.matchScore,
    fill: result.matchScore > 75 ? '#22c55e' : result.matchScore > 50 ? '#eab308' : '#ef4444'
  }];

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
      {/* Top Section: Score & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-slate-500 font-semibold mb-2">Overall Match Score</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="80%" 
                outerRadius="100%" 
                barSize={15} 
                data={scoreData} 
                startAngle={90} 
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-4xl font-bold ${result.matchScore > 75 ? 'text-green-600' : result.matchScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {result.matchScore}%
              </span>
              <span className="text-sm text-slate-400 mt-1">Job Fit</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-800">Executive Summary</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-lg">
            {result.summary}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-start space-x-2">
            <UserCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-purple-700">Experience Alignment:</span> {result.yearsExperienceMatch}
            </p>
          </div>
          <div className="mt-2 flex items-start space-x-2">
             <Briefcase className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
             <p className="text-sm text-slate-500">
              <span className="font-semibold text-indigo-700">Cultural Fit:</span> {result.culturalFit}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matching Skills */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-green-900">Matching Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matchingSkills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-white text-green-700 text-sm font-medium rounded-full shadow-sm border border-green-100">
                {skill}
              </span>
            ))}
            {result.matchingSkills.length === 0 && (
              <p className="text-green-600 italic">No direct matches found yet.</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
          <div className="flex items-center space-x-2 mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Missing Critical Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-white text-red-700 text-sm font-medium rounded-full shadow-sm border border-red-100">
                {skill}
              </span>
            ))}
             {result.missingSkills.length === 0 && (
              <p className="text-red-600 italic">No major skills missing!</p>
            )}
          </div>
          <p className="text-xs text-red-500 mt-4 font-medium">* Consider adding these keywords if you possess the experience.</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Optimization Plan</h3>
        </div>
        <div className="space-y-4">
          {result.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-blue-100/50 hover:shadow-md transition-shadow">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-3 shrink-0">
                {idx + 1}
              </span>
              <p className="text-slate-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;