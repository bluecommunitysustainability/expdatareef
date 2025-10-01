import React, { useState, useEffect } from 'react';
import { QuestionType, type Answers } from '../types';
import type { Question, AnswerObject, AnswerValue } from '../types';
import { FileUploader } from './FileUploader';
import { useTheme } from '../context/ThemeContext';
import { ai } from '../utils/geminiClient';
import { Type } from "@google/genai";
import { generateFullAnswerContext } from '../utils/aiHelper';
import { Modal } from './Modal';

interface QuestionCardProps {
  question: Question;
  currentAnswer: AnswerObject | null;
  onAnswerChange: (answer: AnswerObject) => void;
  destination: string;
  isAdmin: boolean;
  questions: Question[];
  answers: Answers;
}

const BooleanToggle: React.FC<{ value: boolean; onChange: (value: boolean) => void }> = ({ value, onChange }) => {
  const theme = useTheme();
  return (
    <div className="flex items-center space-x-4 mt-2">
      <button 
        onClick={() => onChange(true)} 
        className={`px-6 py-2 rounded-md transition-colors text-sm font-medium ${value === true ? `${theme.background.secondary} text-white` : 'bg-gray-600 hover:bg-gray-500'}`}
      >
        TRUE
      </button>
      <button 
        onClick={() => onChange(false)} 
        className={`px-6 py-2 rounded-md transition-colors text-sm font-medium ${value === false ? 'bg-red-500 text-white' : 'bg-gray-600 hover:bg-gray-500'}`}
      >
        FALSE
      </button>
    </div>
  );
};

const getSourceText = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Remove 'www.' if it exists for cleaner text
    return urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
    // If it's not a valid URL, just return the original string, truncated if necessary
    return url.length > 30 ? `${url.substring(0, 27)}...` : url;
  }
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, currentAnswer, onAnswerChange, destination, isAdmin, questions, answers }) => {
  const [researchStatus, setResearchStatus] = useState<'idle' | 'researching' | 'success' | 'error'>('idle');
  const [isHumanModalOpen, setIsHumanModalOpen] = useState(false);
  const questionText = question.text.replace(/{Destination}/g, destination);
  const theme = useTheme();

  useEffect(() => {
    if (researchStatus === 'success' || researchStatus === 'error') {
      const timer = setTimeout(() => setResearchStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [researchStatus]);

  const handleValueChange = (value: AnswerValue) => {
    onAnswerChange({
      value,
      source: currentAnswer?.source, // Preserve source
      aiGenerated: false, // User interaction overrides AI flag
    });
  };

  const handleAiResearch = async () => {
      setResearchStatus('researching');
      try {
          const fullContext = generateFullAnswerContext(questions, answers, destination);
          const prompt = `You are an expert AI research assistant for sustainable tourism assessments. Your goal is to find a single, factual, and verifiable answer from a public source for the question provided.

          **Destination:**
          ${destination}
          
          **Context from other answered questions:**
          ${fullContext}
          
          ---
          **Question to Research:**
          - ID: "${question.id}"
          - Text: "${questionText}"
          - Expected Answer Type: "${question.type}"
          
          ---
          **Instructions:**
          1.  Conduct a targeted web search to find the answer.
          2.  Prioritize official sources: government websites (.gov), destination management organizations (DMOs), official tourism boards, university studies (.edu), or highly reputable news outlets.
          3.  The answer must be specific and directly address the question.
          4.  You MUST provide the direct URL to the source where you found the information.
          5.  If you cannot find a verifiable answer and source, you must indicate that by setting "found" to false.
          
          **Output Format:**
          Your response MUST be ONLY a single, valid JSON object.
          - For a successful search: \`{"found": true, "answer": "...", "source": "..."}\`
          - If you cannot find an answer: \`{"found": false, "answer": "", "source": ""}\`
          
          - For Boolean questions, the "answer" string must be exactly "true" or "false".
          - For Number questions, the "answer" string must contain only the number (e.g., "12345", "55.7").`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          found: { type: Type.BOOLEAN },
                          answer: { type: Type.STRING },
                          source: { type: Type.STRING }
                      },
                      propertyOrdering: ["found", "answer", "source"]
                  },
              },
          });

          const jsonStr = response.text.trim();
          const result: { found: boolean; answer: string; source: string } = JSON.parse(jsonStr);

          if (result.found && result.answer && result.source) {
              let value: AnswerValue = null;
              let isValid = true;

              switch (question.type) {
                  case QuestionType.NUMBER:
                      const num = parseFloat(String(result.answer).replace(/,/g, ''));
                      value = isNaN(num) ? null : num;
                      break;
                  case QuestionType.BOOLEAN:
                      const upper = String(result.answer).trim().toLowerCase();
                      if (upper === 'true' || upper === 'yes') value = true;
                      else if (upper === 'false' || upper === 'no') value = false;
                      else isValid = false;
                      break;
                  default:
                      value = result.answer;
                      break;
              }

              if (isValid && value !== null) {
                  onAnswerChange({ value, source: result.source, aiGenerated: true });
                  setResearchStatus('success');
              } else {
                  throw new Error(`AI returned an invalid answer format for type ${question.type}: ${result.answer}`);
              }
          } else {
              alert(`AI research could not find a verifiable answer for this question.`);
              setResearchStatus('idle');
          }
      } catch (error) {
          console.error("Error during AI research:", error);
          alert("An error occurred during AI research. Please check the console for details.");
          setResearchStatus('error');
      }
  };

  const renderInput = () => {
    const commonProps = {
      className: `w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${theme.ring.primary} focus:border-${theme.name}-500 mt-1`,
    };

    const answerValue = currentAnswer?.value;

    switch (question.type) {
      case QuestionType.TEXT:
      case QuestionType.URL:
      case QuestionType.EMAIL:
      case QuestionType.TEL:
        return <input type={question.type} {...commonProps} value={(answerValue as string) || ''} onChange={(e) => handleValueChange(e.target.value)} />;
      case QuestionType.NUMBER:
        return <input type="number" {...commonProps} value={(answerValue as number) || ''} onChange={(e) => handleValueChange(e.target.valueAsNumber || null)} />;
      case QuestionType.TEXTAREA:
        return <textarea {...commonProps} rows={4} value={(answerValue as string) || ''} onChange={(e) => handleValueChange(e.target.value)} />;
      case QuestionType.BOOLEAN:
        return <BooleanToggle value={answerValue as boolean} onChange={handleValueChange} />;
      case QuestionType.FILE:
        // File uploader needs to be handled slightly differently
        return <FileUploader currentFile={answerValue as File | string} onChange={(file) => handleValueChange(file)} />;
      default:
        return null;
    }
  };
  
  const researchButtonContent = () => {
      switch(researchStatus) {
          case 'researching':
              return <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Researching...
              </>;
          case 'success':
            return <>✓ Success</>;
          case 'error': return '✗ Error';
          default: return '✨ AI Research';
      }
  };

  const getButtonClass = () => {
    const base = `px-3 py-1 text-xs rounded-md disabled:cursor-not-allowed flex items-center flex-shrink-0 transition-colors`;
    switch(researchStatus) {
        case 'error': return `${base} bg-red-600 text-white`;
        case 'success': return `${base} bg-green-600 text-white`;
        case 'researching': return `${base} bg-gray-800 text-gray-300`;
        default: return `${base} bg-gray-700 hover:bg-gray-600`;
    }
  };

  return (
    <div id={`question-${question.id}`} className="bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 scroll-mt-24">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <label className="block text-md font-medium text-gray-300 flex-1 items-center flex flex-wrap min-w-[60%]">
          <span>
            <span className="font-bold text-gray-400 mr-2">{question.id}.</span>
            {questionText}
          </span>
          {question.badge && (
            <span className="ml-2 mt-1 text-xs font-semibold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-full border border-blue-500/50" style={{lineHeight: '1'}}>
              {question.badge.text}
            </span>
          )}
        </label>
         {isAdmin && question.type !== QuestionType.FILE && (
            <button
              onClick={handleAiResearch}
              disabled={researchStatus === 'researching'}
              className={getButtonClass()}
              title="Use AI to find an answer for this question"
            >
             {researchButtonContent()}
            </button>
        )}
      </div>

      <div className="mt-2">
        {renderInput()}
      </div>

      {currentAnswer?.source && (
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-2 flex-wrap">
            {currentAnswer.aiGenerated && (
                <>
                    <span className="inline-flex items-center gap-1.5 bg-gray-700 text-gray-300 px-2 py-1 rounded-full" title="This answer was generated by AI">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                        AI
                    </span>
                    <button 
                        onClick={() => setIsHumanModalOpen(true)}
                        className="inline-flex items-center gap-1.5 bg-green-900/50 text-green-300 px-2 py-1 rounded-full hover:bg-green-800/50 transition-colors" 
                        title="Help us find a human source for this information."
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        Human
                    </button>
                </>
            )}
            <span>Source:</span>
            <a 
              href={currentAnswer.source} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${theme.text.link} hover:underline truncate`}
              title={currentAnswer.source}
            >
                {getSourceText(currentAnswer.source)}
            </a>
          </div>
      )}
      
      <Modal
        isOpen={isHumanModalOpen}
        onClose={() => setIsHumanModalOpen(false)}
        title="Improve Data Accuracy"
    >
        <div className="text-gray-300 space-y-4">
            <p>
                Do you know someone in <span className="font-bold text-white">{destination}</span> that might be a more reliable source for up-to-date information on this topic?
            </p>
            <p>
                Please tell us with a feedback form. Your contribution helps improve the accuracy and relevance of this assessment for everyone.
            </p>
            <div className="pt-4 text-center">
                 <button
                    onClick={() => {
                        alert("Thank you! (Feedback form not yet implemented)");
                        setIsHumanModalOpen(false);
                    }}
                    className={`px-6 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}
                >
                    Provide Feedback
                </button>
            </div>
        </div>
    </Modal>
    </div>
  );
};
