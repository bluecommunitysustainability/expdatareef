import React, { useState, useMemo } from 'react';
import type { AiContact, Question, Answers, AnswerObject, AnswerValue } from '../types';
import { QuestionType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ai } from '../utils/geminiClient';
import { Type } from "@google/genai";
import { destinationProfiles } from '../constants/destinationProfiles';
import { generateFullAnswerContext } from '../utils/aiHelper';


interface FormAccordionProps {
  section: string;
  completion: { completed: number; total: number };
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  aiContacts?: AiContact[];
  isLoading: boolean;
  onAiSuggestContacts: () => void;
  lastEdited?: string;
  isAdmin: boolean;
  destination: string;
  questions: Question[];
  answers: Answers;
  sectionQuestions: Question[];
  setActiveQuestion: (questionId: string | null) => void;
  setOpenSection: (section: string | null) => void;
  onBulkMergeAnswers: (newAnswers: Answers) => void;
}

const formatTimestamp = (isoString?: string): string | null => {
    if (!isoString) return null;
    try {
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' });
        const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        return `Last Edited: ${formattedDate}, ${formattedTime}`;
    } catch (e) {
        return null;
    }
};

export const FormAccordion: React.FC<FormAccordionProps> = ({
  section,
  completion,
  isOpen,
  onToggle,
  children,
  aiContacts,
  isLoading,
  onAiSuggestContacts,
  lastEdited,
  isAdmin,
  destination,
  questions,
  answers,
  sectionQuestions,
  setActiveQuestion,
  setOpenSection,
  onBulkMergeAnswers
}) => {
  const theme = useTheme();
  const isComplete = completion.completed === completion.total;
  const displayTime = formatTimestamp(lastEdited);

  const [suggestedQuestions, setSuggestedQuestions] = useState<Question[] | null>(null);
  const [isSuggestingQs, setIsSuggestingQs] = useState(false);
  const [isResearching, setIsResearching] = useState(false);

  const unansweredQuantifiableAndBooleanQuestions = useMemo(() => {
    return sectionQuestions.filter(q => {
        // Only target quantifiable (number) and boolean questions for bulk AI research.
        if (q.type !== QuestionType.NUMBER && q.type !== QuestionType.BOOLEAN) {
            return false;
        }
        const answer = answers[q.id];
        return !answer || answer.value === null || answer.value === undefined || answer.value === '';
    });
  }, [sectionQuestions, answers]);


  const handleAiSuggestQuestions = async () => {
    setIsSuggestingQs(true);
    setSuggestedQuestions(null);
    try {
      const profile = destinationProfiles[destination];
      if (!profile) {
        alert("No destination profile found to make suggestions.");
        return;
      }

      const questionListText = sectionQuestions
        .map(q => `ID: ${q.id}, Text: ${q.text.replace('{Destination}', destination)}`)
        .join('\n');
      
      const prompt = `You are a sustainability consultant for tourism destinations. The destination "${destination}" has the following profile:
- Characteristics: ${profile.profile.join(', ')}
- Tourism Focus: ${profile.focus.join(', ')}

From the following list of questions for the "${section}" section, please identify the top 3 most critical questions to prioritize for this specific destination.

Question List:
${questionListText}

Return ONLY a JSON object with a single key "suggested_ids" containing an array of the top 3 question IDs.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggested_ids: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            propertyOrdering: ["suggested_ids"]
          }
        }
      });

      const result = JSON.parse(response.text.trim());
      const ids: string[] = result.suggested_ids;
      if (ids && ids.length > 0) {
        const suggestions = questions.filter(q => ids.includes(q.id));
        setSuggestedQuestions(suggestions);
      } else {
        alert("AI could not determine priority questions for this section.");
      }
    } catch (e) {
      console.error("Error suggesting questions:", e);
      alert("An error occurred while suggesting questions. Please check the console.");
    } finally {
      setIsSuggestingQs(false);
    }
  };
  
  const handleAiResearchSection = async () => {
    if (unansweredQuantifiableAndBooleanQuestions.length === 0) {
        alert("All applicable quantifiable and boolean questions in this section are already answered.");
        return;
    }
    setIsResearching(true);
    try {
        const fullContext = generateFullAnswerContext(questions, answers, destination);
        const questionsToResearch = unansweredQuantifiableAndBooleanQuestions.map(q => ({
            id: q.id,
            text: q.text.replace('{Destination}', destination),
            type: q.type
        }));

        const prompt = `You are an expert AI research assistant for sustainable tourism assessments. Your goal is to find factual, verifiable answers from public sources for a list of questions about a specific destination.

**Destination:** ${destination}
          
**Existing Context (from other answered questions):**
${fullContext}
          
---
**Questions to Research for the "${section}" section:**
${JSON.stringify(questionsToResearch, null, 2)}
          
---
**Instructions:**
1.  For each question in the list, conduct a targeted web search to find the answer.
2.  Prioritize official sources: government websites (.gov), destination management organizations (DMOs), official tourism boards, university studies (.edu), or highly reputable news outlets.
3.  For each question, you MUST provide the direct URL to the source where you found the information.
4.  If you cannot find a verifiable answer and source for a specific question, you MUST indicate that by setting "found" to false for that item. Do not make up answers.
5.  Format your answers to match the expected type (e.g., for "boolean", the answer string must be exactly "true" or "false"; for "number", the answer string must contain only the number like "12345").
          
**Output Format:**
Your response MUST be ONLY a single, valid JSON object with a single key "results", which is an array of objects. Each object in the array must have the following structure:
- \`questionId\`: The ID of the question (e.g., "q14a").
- \`found\`: A boolean (true/false) indicating if you found an answer.
- \`answer\`: The string representation of the answer.
- \`source\`: The direct URL to the source.
`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        results: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    questionId: { type: Type.STRING },
                                    found: { type: Type.BOOLEAN },
                                    answer: { type: Type.STRING },
                                    source: { type: Type.STRING }
                                },
                                propertyOrdering: ["questionId", "found", "answer", "source"]
                            }
                        }
                    }
                },
            },
        });
        
        const jsonStr = response.text.trim();
        const result: { results: { questionId: string; found: boolean; answer: string; source: string }[] } = JSON.parse(jsonStr);

        const newAnswers: Answers = {};
        let foundCount = 0;

        if (result.results && Array.isArray(result.results)) {
            result.results.forEach(item => {
                if (!item.found || !item.answer || !item.source) return;

                const question = unansweredQuantifiableAndBooleanQuestions.find(q => q.id === item.questionId);
                if (!question) return;

                let value: AnswerValue = null;
                let isValid = true;
                
                switch (question.type) {
                    case QuestionType.NUMBER:
                        const num = parseFloat(String(item.answer).replace(/,/g, ''));
                        value = isNaN(num) ? null : num;
                        break;
                    case QuestionType.BOOLEAN:
                        const upper = String(item.answer).trim().toLowerCase();
                        if (upper === 'true' || upper === 'yes') value = true;
                        else if (upper === 'false' || upper === 'no') value = false;
                        else isValid = false;
                        break;
                    default:
                        value = item.answer;
                        break;
                }

                if (isValid && value !== null && value !== '') {
                    newAnswers[item.questionId] = { value, source: item.source, aiGenerated: true };
                    foundCount++;
                }
            });
        }
        
        if (Object.keys(newAnswers).length > 0) {
            onBulkMergeAnswers(newAnswers);
        }

        alert(`AI research complete. Found ${foundCount} out of ${unansweredQuantifiableAndBooleanQuestions.length} possible answers.`);

    } catch (e) {
        console.error("Error during AI section research:", e);
        alert("An error occurred during AI research. Please check the console for details.");
    } finally {
        setIsResearching(false);
    }
  };


  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
            <span className={`text-lg font-bold ${isOpen ? theme.text.primary : 'text-gray-200'}`}>{section}</span>
            <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${isComplete ? `${theme.background.secondary} text-white` : 'bg-gray-600'}`}>
                {completion.completed}/{completion.total}
            </span>
        </div>
        <div className="flex items-center gap-3">
             {displayTime && <span className="text-xs text-gray-500 font-normal hidden sm:block">{displayTime}</span>}
            <svg
              className={`w-6 h-6 transform transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
            {isAdmin && (
              <div className={`border-t ${theme.border.primary} pt-4 mb-4 flex justify-end items-center flex-wrap gap-3`}>
                  <button
                      onClick={handleAiResearchSection}
                      disabled={isResearching || unansweredQuantifiableAndBooleanQuestions.length === 0}
                      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                      title={unansweredQuantifiableAndBooleanQuestions.length > 0
                          ? `Use AI to research ${unansweredQuantifiableAndBooleanQuestions.length} remaining questions.`
                          : "All applicable questions in this section are answered."
                      }
                  >
                      {isResearching ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Researching...
                          </>
                      ) : '✨ AI Answer Questions'}
                  </button>
                  <button
                      onClick={handleAiSuggestQuestions}
                      disabled={isSuggestingQs}
                      className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                      {isSuggestingQs ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Suggesting...
                          </>
                      ) : 'Suggest Priority Questions'}
                  </button>
                  <button
                      onClick={onAiSuggestContacts}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                      {isLoading ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Suggesting...
                          </>
                      ) : 'Suggest Contacts'}
                </button>
              </div>
            )}
            
            {suggestedQuestions && (
                <div className={`bg-gray-900/30 p-4 rounded-lg mb-6 border ${theme.border.primary}`}>
                    <h3 className={`font-semibold ${theme.text.primary} mb-2`}>AI Suggested Priority Questions:</h3>
                    <ul className="space-y-2">
                    {suggestedQuestions.map(q => (
                        <li key={q.id}>
                            <button
                                onClick={() => {
                                    setOpenSection(section);
                                    setActiveQuestion(q.id);
                                }}
                                className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-700/50 transition-colors"
                            >
                                {q.text.replace('{Destination}', destination)}
                            </button>
                        </li>
                    ))}
                    </ul>
                </div>
            )}

            {aiContacts && (
                <div className={`bg-gray-900/30 p-4 rounded-lg mb-6 border ${theme.border.primary}`}>
                    <h3 className={`font-semibold ${theme.text.primary} mb-2`}>AI Suggested Contacts:</h3>
                    <ul className="space-y-2">
                        {aiContacts.map((contact, index) => (
                            <li key={index} className="text-sm">
                                <strong className="text-gray-200">{contact.name}</strong>
                                <p className="text-gray-400">{contact.description}</p>
                                {contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer" className={`${theme.text.link} hover:underline`}>{contact.website}</a>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {children}
        </div>
      )}
    </div>
  );
};