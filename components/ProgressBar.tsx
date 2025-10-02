import React, { useMemo } from 'react';
import type { Answers, Question } from '../types';

// A palette of distinct, accessible colors, inspired by SDG and Tailwind palettes.
const SECTION_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
  '#78716c', // stone-500
  '#6b7280', // gray-500
  '#0891b2', // cyan-600
  '#4f46e5', // indigo-600
  '#be185d', // pink-700
];

interface ProgressBarProps {
  questions: Question[];
  answers: Answers;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ questions, answers }) => {
  const { sectionsData, overallCompleted, globalTotal } = useMemo(() => {
    const questionsBySection = questions.reduce((acc, question) => {
      (acc[question.section] = acc[question.section] || []).push(question);
      return acc;
    }, {} as Record<string, Question[]>);

    const orderedSections = Object.keys(questionsBySection);
    const globalTotalQuestions = questions.length;
    let totalCompleted = 0;

    const data = orderedSections.map((sectionName, index) => {
      const sectionQuestions = questionsBySection[sectionName];
      const total = sectionQuestions.length;
      const completed = sectionQuestions.filter(q => {
        const answer = answers[q.id];
        return answer && answer.value !== null && answer.value !== undefined && answer.value !== '';
      }).length;

      totalCompleted += completed;
      
      return {
        name: sectionName,
        completed,
        total,
        sectionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        globalWidthPercentage: globalTotalQuestions > 0 ? (total / globalTotalQuestions) * 100 : 0,
        color: SECTION_COLORS[index % SECTION_COLORS.length],
      };
    });

    return {
      sectionsData: data,
      overallCompleted: totalCompleted,
      globalTotal: globalTotalQuestions,
    };
  }, [questions, answers]);

  const overallPercentage = globalTotal > 0 ? Math.round((overallCompleted / globalTotal) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">Overall Progress</span>
        <span className="text-sm font-medium text-teal-400">{overallPercentage}% Complete</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={overallPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${overallPercentage}% of all metrics completed`}
        className="w-full bg-gray-700 rounded-full h-3 flex overflow-hidden"
      >
        {sectionsData.map((section, index) => (
          <div
            key={section.name}
            className="group relative h-full bg-gray-600/50 transition-all duration-200 hover:scale-y-125 hover:z-10"
            style={{ width: `${section.globalWidthPercentage}%` }}
          >
            {/* Filled portion */}
            <div
              className="h-full rounded-full"
              style={{
                width: `${section.sectionPercentage}%`,
                backgroundColor: section.color,
              }}
            />
            
            {/* Divider */}
            {index < sectionsData.length - 1 && (
                <div className="absolute top-0 right-0 h-full w-px bg-gray-900" />
            )}

            {/* Tooltip */}
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 border border-gray-600 rounded-lg shadow-lg text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              role="tooltip"
            >
              <h4 className="font-bold text-white truncate">{section.name}</h4>
              <p>{section.completed} / {section.total} Complete</p>
              <p className="font-semibold" style={{ color: section.color }}>{section.sectionPercentage}%</p>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
