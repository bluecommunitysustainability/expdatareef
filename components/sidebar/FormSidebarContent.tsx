import React from 'react';
import type { Answers, Question } from '../../types';
import { ProgressBar } from '../ProgressBar';
import { Accordion } from './Accordion';
import { Tooltip } from '../Tooltip';
import { useTheme } from '../../context/ThemeContext';

// Data for tooltips
import { sdgMapping, sdgData } from '../../constants/sdgs';
import { gstcCriteria } from '../../constants/gstcCriteria';
import { questionGstcMapping } from '../../constants/questionGstcMapping';


interface FormSidebarContentProps {
  questionsBySection: Record<string, Question[]>;
  answers: Answers;
  totalQuestions: number;
  completedQuestions: number;
  onQuestionSelect: (questionId: string) => void;
}

const getSectionCompletion = (questions: Question[], answers: Answers) => {
  const answered = questions.filter(q => {
    const answer = answers[q.id];
    return answer && answer.value !== null && answer.value !== undefined && answer.value !== '';
  }).length;
  return {
    completed: answered,
    total: questions.length
  };
};

export const FormSidebarContent: React.FC<FormSidebarContentProps> = ({
  questionsBySection,
  answers,
  totalQuestions,
  completedQuestions,
  onQuestionSelect
}) => {
  const theme = useTheme();

  return (
    <div className="space-y-4">
      <div className="p-4">
         <ProgressBar completed={completedQuestions} total={totalQuestions} />
      </div>

      {Object.entries(questionsBySection).map(([section, questions]) => {
          const { completed, total } = getSectionCompletion(questions, answers);
          const isComplete = completed === total;

          const title = (
            <div className="flex items-center justify-between w-full">
                <span>{section}</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${isComplete ? `${theme.background.secondary} text-white` : 'bg-gray-600'}`}>
                    {completed}/{total}
                </span>
            </div>
          );

        return (
          <Accordion key={section} title={title}>
            <ul className="space-y-1">
              {questions.map(q => {
                  const answer = answers[q.id];
                  const isAnswered = answer && answer.value !== null && answer.value !== undefined && answer.value !== '';
                  
                  const sdgInfo = sdgMapping[q.id];
                  const relatedGstcIds = questionGstcMapping[q.id] || [];
                  const relatedGstcCriteria = gstcCriteria.filter(c => relatedGstcIds.includes(c.id));

                  const tooltipContent = (
                    <div className="p-1 space-y-2">
                      <p className="font-bold text-white">{q.text.replace('{Destination}', '')}</p>
                      
                      {sdgInfo && sdgInfo.sdgIds.length > 0 && (
                        <div className="pt-2 border-t border-gray-700">
                          <h4 className="font-semibold text-gray-300">Related SDGs:</h4>
                          <ul className="list-disc list-inside text-gray-400">
                            {sdgInfo.sdgIds.map(id => {
                              const goal = sdgData.find(g => g.id === id);
                              return <li key={id}>{goal?.name}</li>;
                            })}
                          </ul>
                        </div>
                      )}

                      {relatedGstcCriteria.length > 0 && (
                        <div className="pt-2 border-t border-gray-700">
                          <h4 className="font-semibold text-gray-300">Related GSTC Criteria:</h4>
                          <ul className="space-y-3 mt-2">
                            {relatedGstcCriteria.map(c => (
                              <li key={c.id}>
                                <p className="font-semibold text-white">
                                  <span className="font-mono bg-gray-700 text-teal-300 px-1.5 py-0.5 rounded text-xs mr-2">{c.id}</span>
                                  {c.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 pl-2 border-l-2 border-gray-700 ml-2">
                                  {c.description}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                  
                  return (
                    <li key={q.id}>
                        <Tooltip content={tooltipContent}>
                            <button
                                onClick={() => onQuestionSelect(q.id)}
                                className="w-full text-left p-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md flex items-center"
                            >
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 flex-shrink-0 ${isAnswered ? `bg-${theme.name}-400` : 'bg-gray-500'}`}></span>
                                <span className="truncate">{q.id}. {q.text.replace(/{Destination}/g, '')}</span>
                            </button>
                        </Tooltip>
                    </li>
                  )
              })}
            </ul>
          </Accordion>
        );
      })}
    </div>
  );
};