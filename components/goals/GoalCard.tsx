import React, { useState } from 'react';
import type { Question, AnswerObject, GoalObject, Answers } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { ai } from '../../utils/geminiClient';
import { Type } from "@google/genai";
import { generateFullAnswerContext } from '../../utils/aiHelper';


interface GoalCardProps {
  question: Question;
  currentAnswer: AnswerObject | null;
  currentGoal: GoalObject | null;
  onGoalUpdate: (questionId: string, goal: GoalObject) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  // Props needed for AI context
  questions: Question[];
  answers: Answers;
  destination: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  question,
  currentAnswer,
  currentGoal,
  onGoalUpdate,
  isLoggedIn,
  isAdmin,
  questions,
  answers,
  destination,
}) => {
  const theme = useTheme();
  const [isAssisting, setIsAssisting] = useState(false);
  const currentValue = (currentAnswer?.value as number) ?? 0;
  const goalValue = currentGoal?.value ?? 0;
  const targetDate = currentGoal?.targetDate ?? '';
  const comments = currentGoal?.comments ?? '';

  const progressPercentage = goalValue > 0 ? Math.min(Math.round((currentValue / goalValue) * 100), 100) : 0;

  const handleGoalValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    onGoalUpdate(question.id, {
      ...currentGoal,
      value: isNaN(value) ? null : value,
      comments: currentGoal?.comments,
      targetDate: currentGoal?.targetDate,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGoalUpdate(question.id, {
      ...currentGoal,
      targetDate: e.target.value,
      value: currentGoal?.value ?? null,
      comments: currentGoal?.comments
    });
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onGoalUpdate(question.id, {
        ...currentGoal,
        comments: e.target.value,
        value: currentGoal?.value ?? null,
        targetDate: currentGoal?.targetDate
    });
  };

  const handleAiAssist = async () => {
    setIsAssisting(true);
    try {
        const fullContext = generateFullAnswerContext(questions, answers, destination);
        const prompt = `You are an expert AI assistant for setting sustainable tourism goals. Your task is to suggest a realistic, ambitious, but achievable goal for a specific metric.

        **Destination:** ${destination}

        **Metric to Set a Goal For:**
        - Question: "${question.text.replace('{Destination}', destination)}"
        - Current Value: ${currentValue}

        **Context from other answered questions:**
        ${fullContext}

        ---
        **Instructions:**
        1. Analyze the metric and the provided context.
        2. Suggest a single, numerical goal that represents a meaningful improvement.
        3. Provide a brief, one-sentence rationale for your suggestion.
        4. If the current value is 0, suggest a sensible starting goal (e.g., 10, 100).
        5. If the question implies a reduction is better (e.g., waste to landfill), suggest a goal lower than the current value. Assume for most metrics, a higher number is better.
        
        **Output Format:**
        Your response MUST be ONLY a single, valid JSON object with the following structure:
        {
            "suggestedGoal": <number>,
            "rationale": "<string>"
        }`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedGoal: { type: Type.NUMBER },
                        rationale: { type: Type.STRING }
                    },
                    propertyOrdering: ["suggestedGoal", "rationale"]
                }
            }
        });

        const result = JSON.parse(response.text.trim());
        if (result.suggestedGoal && result.rationale) {
            alert(`AI Suggestion: ${result.rationale}`);
            onGoalUpdate(question.id, {
                value: result.suggestedGoal,
                comments: currentGoal?.comments ?? `AI Rationale: ${result.rationale}`,
                targetDate: currentGoal?.targetDate
            });
        }

    } catch(error) {
        console.error("Error getting AI goal suggestion:", error);
        alert("An error occurred while getting an AI suggestion. Please check the console.");
    } finally {
        setIsAssisting(false);
    }
  };


  return (
    <div className={`bg-gray-900/50 p-5 rounded-lg border border-gray-700/50 flex flex-col justify-between h-full`}>
      <div>
        <p className="text-sm text-gray-400 font-medium line-clamp-2 h-10">{question.text.replace('{Destination}', '')}</p>
        <div className="mt-4 flex justify-between items-baseline gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Current</label>
            <p className="text-2xl font-bold text-white">{currentValue.toLocaleString()}</p>
          </div>
          <div className="text-2xl text-gray-500">&rarr;</div>
          <div className="flex-1">
             <div className="flex justify-between items-center">
                <label htmlFor={`goal-${question.id}`} className="text-xs text-gray-500 uppercase tracking-wider">Goal</label>
                {isAdmin && (
                    <button 
                        onClick={handleAiAssist}
                        disabled={isAssisting}
                        className="px-2 py-0.5 text-xs rounded-md disabled:cursor-not-allowed flex items-center transition-colors bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800"
                        title="Get an AI-powered goal suggestion"
                    >
                        {isAssisting ? (
                            <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : '✨ Assist'}
                    </button>
                )}
            </div>
            <input
              id={`goal-${question.id}`}
              type="number"
              value={currentGoal?.value ?? ''}
              onChange={handleGoalValueChange}
              disabled={!isLoggedIn}
              placeholder="Set target"
              className={`w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-2xl font-bold text-white focus:outline-none focus:ring-2 ${theme.ring.primary} text-right mt-1`}
            />
          </div>
        </div>

        {goalValue > 0 && (
          <div className="mt-4">
             <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-300">Progress to Goal</span>
                <span className={`text-xs font-medium ${theme.text.primary}`}>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                className={`${theme.background.secondary} h-2 rounded-full transition-all duration-500`} 
                style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700/50 space-y-4">
        <div>
            <label htmlFor={`date-${question.id}`} className="text-xs text-gray-500 uppercase tracking-wider">Target Date</label>
            <input
            id={`date-${question.id}`}
            type="date"
            value={targetDate}
            onChange={handleDateChange}
            disabled={!isLoggedIn}
            className={`w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 ${theme.ring.primary} mt-1`}
            />
        </div>
        <div>
            <label htmlFor={`comments-${question.id}`} className="text-xs text-gray-500 uppercase tracking-wider">Notes / Comments</label>
            <textarea
                id={`comments-${question.id}`}
                value={comments}
                onChange={handleCommentsChange}
                disabled={!isLoggedIn}
                rows={3}
                placeholder="Add context or notes for this goal..."
                className={`w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 ${theme.ring.primary} mt-1`}
            />
        </div>
      </div>
    </div>
  );
};
