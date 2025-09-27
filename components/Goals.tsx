import React, { useMemo } from 'react';
import type { Question, Answers, Goals, GoalObject } from '../types';
import { QuestionType } from '../types';
import { GoalCard } from './goals/GoalCard';
import { useTheme } from '../context/ThemeContext';

interface GoalsViewProps {
  questions: Question[];
  answers: Answers;
  goals: Goals;
  onGoalUpdate: (questionId: string, goal: GoalObject) => void;
  isLoggedIn: boolean;
  destination: string;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  questions,
  answers,
  goals,
  onGoalUpdate,
  isLoggedIn,
  destination,
}) => {
  const theme = useTheme();
  
  const quantifiableQuestions = useMemo(() => {
    return questions.filter(q => q.type === QuestionType.NUMBER);
  }, [questions]);

  const questionsBySection = useMemo(() => {
    return quantifiableQuestions.reduce((acc, question) => {
      (acc[question.section] = acc[question.section] || []).push(question);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [quantifiableQuestions]);

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-400">Access Denied</h2>
          <p className="mt-2 text-lg text-gray-400">
            You must be logged in to set and view team goals.
          </p>
        </div>
      </div>
    );
  }
  
  const sections = Object.keys(questionsBySection);

  return (
    <div className="space-y-8">
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
        <h2 className="text-lg font-semibold text-white">Team Goals</h2>
        <p className="text-sm text-gray-400">Set targets for quantifiable metrics to track progress over time.</p>
      </div>
      
      {sections.length > 0 ? sections.map(section => (
        <section key={section}>
          <div className={`border-b ${theme.border.primary} pb-4 mb-6`}>
            <h2 className={`text-2xl font-bold ${theme.text.primary}`}>{section}</h2>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {questionsBySection[section].map(question => (
                <GoalCard
                  key={question.id}
                  question={question}
                  currentAnswer={answers[question.id] ?? null}
                  currentGoal={goals[question.id] ?? null}
                  onGoalUpdate={onGoalUpdate}
                  isLoggedIn={isLoggedIn}
                  questions={questions}
                  answers={answers}
                  destination={destination}
                />
              ))}
           </div>
        </section>
      )) : (
         <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 h-full flex items-center justify-center">
            <p className="text-lg text-gray-500">No quantifiable questions available to set goals.</p>
        </div>
      )}
    </div>
  );
};