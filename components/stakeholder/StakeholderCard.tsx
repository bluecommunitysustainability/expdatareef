import React from 'react';
import type { AnswerObject, Question, GoalObject } from '../../types';
import { QuestionType } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface StakeholderCardProps {
    question: Question;
    answer: AnswerObject | null;
    goal: GoalObject | null;
    timestamp?: string;
    onOpenDetail: () => void;
    themeMode: 'light' | 'dark'; // Kept for prop compatibility, but will use dark theme
}

const getStatus = (answer: AnswerObject | null): { text: string; color: string } => {
    if (!answer || answer.value === null || answer.value === undefined || answer.value === '') {
        return { text: 'Incomplete', color: 'bg-gray-500' };
    }
    if (typeof answer.value === 'boolean') {
        return answer.value ? { text: 'Complete', color: 'bg-green-600' } : { text: 'Action Needed', color: 'bg-red-600' };
    }
    if (typeof answer.value === 'number') {
        return answer.value > 0 ? { text: 'Complete', color: 'bg-green-600' } : { text: 'Action Needed', color: 'bg-red-600' };
    }
    return { text: 'In Progress', color: 'bg-yellow-600' };
};

const getDisplayAnswer = (answer: AnswerObject | null): string => {
    if (!answer || answer.value === null || answer.value === undefined || answer.value === '') return 'No Data';
    if (typeof answer.value === 'boolean') return answer.value ? 'Yes' : 'No';
    if (answer.value instanceof File) return answer.value.name;
    return String(answer.value);
};

const formatTimestamp = (isoString?: string): string => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString();
};

export const StakeholderCard: React.FC<StakeholderCardProps> = ({ question, answer, goal, timestamp, onOpenDetail }) => {
    const appTheme = useTheme();
    const status = getStatus(answer);
    const displayAnswer = getDisplayAnswer(answer);
    const isAnswered = answer && answer.value !== null && answer.value !== undefined && answer.value !== '';
    const isQuantifiable = question.type === QuestionType.NUMBER;

    const currentValue = (answer?.value as number) ?? 0;
    const goalValue = goal?.value ?? 0;
    const progressPercentage = isQuantifiable && goalValue > 0 ? Math.min(Math.round((currentValue / goalValue) * 100), 100) : null;
    
    return (
        <div className={`bg-gray-800 rounded-lg shadow-lg border-l-4 ${appTheme.border.primary} flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isAnswered ? 'opacity-100' : 'opacity-70'}`}>
            <div className="p-4 flex-1">
                <p className={`text-sm text-gray-400 line-clamp-2 h-10`}>{question.text.replace(/{Destination}/g, '')}</p>
                
                {isQuantifiable ? (
                    <div className="mt-2 grid grid-cols-2 gap-4 items-end">
                        <div>
                            <span className={`text-xs text-gray-400 uppercase`}>Current</span>
                            <p className={`text-2xl font-bold text-white truncate`} title={displayAnswer}>{displayAnswer}</p>
                        </div>
                        {goalValue > 0 && (
                            <div className="text-right">
                                <span className={`text-xs text-gray-400 uppercase`}>Goal</span>
                                <p className={`text-2xl font-bold ${appTheme.text.primary} truncate`} title={String(goalValue)}>{goalValue.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className={`text-2xl font-bold text-white mt-2 truncate`} title={displayAnswer}>{displayAnswer}</p>
                )}

                {progressPercentage !== null && (
                     <div className="mt-3">
                        <div className={`w-full bg-gray-700 rounded-full h-1.5`}>
                            <div 
                                className={`${appTheme.background.secondary} h-1.5 rounded-full`}
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
            <div className={`p-4 border-t border-gray-700 text-xs text-gray-400`}>
                <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-0.5 text-white text-xs font-semibold rounded-full ${status.color}`}>{status.text}</span>
                    <div className="flex items-center gap-1" title="Trend (No Change)">
                        <span>Trend</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span>Updated: {formatTimestamp(timestamp)}</span>
                    <button onClick={onOpenDetail} className="hover:text-blue-400 disabled:text-gray-600 disabled:cursor-not-allowed" title="View Details" disabled={!isAnswered}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};