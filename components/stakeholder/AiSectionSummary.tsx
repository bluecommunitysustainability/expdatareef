

import React, { useState, useEffect, useMemo } from 'react';
import type { Answers, Question, AnswerObject, SdgDetailInfo } from '../../types';
import { ai } from '../../utils/geminiClient';
import { AiMarkdown } from '../AiMarkdown';
import { useTheme } from '../../context/ThemeContext';
import { SdgAlignmentVisuals } from './SdgAlignmentVisuals';
import { sdgMapping } from '../../constants/sdgs';
import { sdgDetails } from '../../constants/sdgDetails';

interface AiSectionSummaryProps {
  sectionName: string;
  sectionQuestions: Question[];
  sectionAnswers: Answers;
  destination: string;
}

export const AiSectionSummary: React.FC<AiSectionSummaryProps> = ({ sectionName, sectionQuestions, sectionAnswers, destination }) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  
  const answeredCount = Object.keys(sectionAnswers).length;
  const totalCount = sectionQuestions.length;
  const completionPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
  const shouldGenerate = completionPercentage >= 90;

  useEffect(() => {
    if (!shouldGenerate) {
      setSummary('');
      return;
    }

    const generateSummary = async () => {
      setIsLoading(true);
      setError(null);

      const context = sectionQuestions
        .filter(q => sectionAnswers[q.id])
        .map(q => {
          const answerObj = sectionAnswers[q.id];
          let answerText = answerObj?.value;
          if (answerText instanceof File) answerText = answerText.name;
          else if (typeof answerText === 'boolean') answerText = answerText ? 'Yes' : 'No';
          return `- ${q.text.replace('{Destination}', destination)}: **${answerText}**`;
        }).join('\n');
      
      const prompt = `As a sustainability analyst, provide a brief, insightful summary for the "${sectionName}" section of a tourism assessment for ${destination}. 
      Analyze the following data points, interpreting them as sustainability performance indicators. 
      Highlight key strengths and potential areas for improvement based ONLY on the provided data. 
      Keep the tone professional and constructive. Format the response using markdown with bold text for emphasis.
      
      Data for ${sectionName}:
      ${context}
      `;

      try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        setSummary(response.text);
      } catch (e) {
        console.error("Error generating AI section summary:", e);
        setError("Failed to generate AI analysis.");
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();

  }, [JSON.stringify(sectionAnswers), sectionName, destination, sectionQuestions, shouldGenerate]);

  const sdgAlignments = useMemo(() => {
    const isPositive = (answer: AnswerObject | undefined | null): boolean => {
        if (!answer || answer.value === null || answer.value === undefined || answer.value === '') return false;
        if (typeof answer.value === 'boolean') return answer.value;
        if (typeof answer.value === 'number') return answer.value > 0;
        if (typeof answer.value === 'string') return answer.value.trim().length > 0;
        if (answer.value instanceof File) return true;
        return false;
    };
    
    const sdgToQuestions: Map<number, string[]> = new Map();

    sectionQuestions.forEach(q => {
      const sdgInfo = sdgMapping[q.id];
      if (sdgInfo) {
        sdgInfo.sdgIds.forEach(sdgId => {
          if (!sdgToQuestions.has(sdgId)) sdgToQuestions.set(sdgId, []);
          sdgToQuestions.get(sdgId)!.push(q.id);
        });
      }
    });

    if (sdgToQuestions.size === 0) return [];

    const alignments: { sdg: SdgDetailInfo; score: number }[] = [];
    
    sdgToQuestions.forEach((questionIds, sdgId) => {
        const totalQuestionsForSdg = questionIds.length;
        const positiveAnswersForSdg = questionIds.filter(qId => isPositive(sectionAnswers[qId])).length;
        
        const score = totalQuestionsForSdg > 0 ? (positiveAnswersForSdg / totalQuestionsForSdg) * 100 : 0;
        const sdgDetail = sdgDetails.find(d => d.id === sdgId);

        if (sdgDetail) {
            alignments.push({ sdg: sdgDetail, score });
        }
    });

    return alignments.sort((a, b) => a.sdg.id - b.sdg.id);
  }, [sectionQuestions, sectionAnswers]);


  return (
    <div className={`bg-gray-800/10 p-4 rounded-lg border-l-4 border-${theme.name}-500/50 mb-4`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">AI Analysis</h3>
                {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating summary...
                    </div>
                )}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!isLoading && !error && summary && shouldGenerate && <AiMarkdown text={summary} />}
                {!isLoading && !error && !shouldGenerate && (
                    <p className="text-sm text-gray-500 italic">
                    Analysis will be available when at least 90% of metrics in this section are complete. ({answeredCount}/{totalCount})
                    </p>
                )}
            </div>
            <div>
                <SdgAlignmentVisuals alignments={sdgAlignments} />
            </div>
        </div>
    </div>
  );
};