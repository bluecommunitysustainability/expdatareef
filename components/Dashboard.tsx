import React, { useMemo, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Answers, Question, AnswerObject } from '../types';
import { QuestionType } from '../types';
import { sdgMapping } from '../constants/sdgs';
import { StatCard } from './dashboard/StatCard';
import { QualitativeCard } from './dashboard/QualitativeCard';
import { Modal } from './Modal';
import { useTheme } from '../context/ThemeContext';
import { AiMarkdown } from './AiMarkdown';
import { WasteChart } from './dashboard/WasteChart';
import { EnergyChart } from './dashboard/EnergyChart';
import { WordCloud } from './dashboard/WordCloud';
import { generateFullAnswerContext } from '../utils/aiHelper';
import { AiSectionSummary } from './stakeholder/AiSectionSummary';

interface DashboardProps {
  answers: Answers;
  destination: string;
  questions: Question[];
}

export const Dashboard: React.FC<DashboardProps> = ({ answers, destination, questions }) => {
  const [modalContent, setModalContent] = useState<{ title: string; content: string; } | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const theme = useTheme();

  const questionsBySection = useMemo(() => {
    const dashboardQuestions = questions.filter(q => q.type !== QuestionType.FILE);

    return dashboardQuestions.reduce((acc, question) => {
      (acc[question.section] = acc[question.section] || []).push(question);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [questions]);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setAiSummary('');

    const answeredQuestions = questions.filter(q => {
        const answer = answers[q.id];
        return answer && answer.value !== null && answer.value !== undefined && answer.value !== '';
    });

    if (answeredQuestions.length === 0) {
        alert("Please answer some questions before generating a summary.");
        setIsGeneratingSummary(false);
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const fullContext = generateFullAnswerContext(questions, answers, destination);

        const prompt = `You are a world-class sustainability analyst providing a detailed report for the tourist destination of "${destination}". 
Based on the comprehensive assessment data provided below, generate a professional sustainability report.

**Instructions:**
1.  Begin with a concise **Executive Summary** (2-3 sentences).
2.  Create a section titled **Key Strengths**, highlighting areas where the destination is performing well. Use bullet points.
3.  Create a section titled **Areas for Improvement**, identifying key weaknesses or gaps in their sustainability efforts. Use bullet points.
4.  Create a section titled **Actionable Recommendations**, providing specific, concrete suggestions for improvement based on the identified weaknesses. Frame these as actionable steps.
5.  Your entire response must be in Markdown format. Use '##' for section titles.

**Assessment Data:**
${fullContext}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        setAiSummary(response.text);
        setIsSummaryModalOpen(true);

    } catch (error) {
        console.error("Error generating AI summary:", error);
        alert("Failed to generate AI summary. Please check the console for details.");
    } finally {
        setIsGeneratingSummary(false);
    }
  };


  const handleOpenModal = (question: Question, answer: string) => {
    const title = question.text.replace(/{Destination}/g, destination);
    setModalContent({ title, content: answer });
  };
  
  const renderWidget = (question: Question) => {
      const answerObj = answers[question.id];
      const answerValue = answerObj?.value;
      const sdgInfo = sdgMapping[question.id];
      
      if (!answerObj || answerValue === null || answerValue === undefined) return null;

      switch(question.type) {
          case QuestionType.NUMBER:
          case QuestionType.BOOLEAN:
              return <StatCard key={question.id} question={question} value={answerValue} sdgInfo={sdgInfo} destination={destination} />;
          
          case QuestionType.TEXTAREA:
          case QuestionType.TEXT:
          case QuestionType.URL:
          case QuestionType.EMAIL:
          case QuestionType.TEL:
             if (typeof answerValue !== 'string' || answerValue.trim() === '') return null;
             return <QualitativeCard key={question.id} question={question} value={answerValue} sdgInfo={sdgInfo} onReadMore={() => handleOpenModal(question, answerValue)} destination={destination} />

          default:
              return null;
      }
  };

  return (
    <div className="space-y-12">
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex items-center justify-between">
        <div>
            <h2 className="text-lg font-semibold text-white">Sustainability Overview</h2>
            <p className="text-sm text-gray-400">Analyze your data and generate an AI-powered summary.</p>
        </div>
        <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary} ${theme.background.disabled} disabled:cursor-not-allowed flex items-center`}
        >
            {isGeneratingSummary ? (
                 <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </>
            ) : '✨ Generate AI Summary'}
        </button>
      </div>
      
      <section>
        <div className={`border-b ${theme.border.primary} pb-4 mb-6`}>
            <h2 className={`text-2xl font-bold ${theme.text.primary}`}>Visual Insights</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">Waste Management Overview</h3>
                <WasteChart answers={answers} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">Energy Consumption Mix</h3>
                <EnergyChart answers={answers} />
            </div>
        </div>
        <div className="mt-8 bg-gray-800/25 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">Key Themes from Responses</h3>
            <WordCloud answers={answers} questions={questions} />
        </div>
      </section>

      {Object.keys(questionsBySection).map(section => {
        const sectionId = `dashboard-section-${section.replace(/\s+/g, '-')}`;
        const sectionQuestions = questionsBySection[section];
        const sectionAnswers = sectionQuestions.reduce((acc, q) => {
            if (answers[q.id]) {
                acc[q.id] = answers[q.id];
            }
            return acc;
        }, {} as Answers);

        return (
          <section key={section} id={sectionId} className="scroll-mt-24">
            <div className={`border-b ${theme.border.primary} pb-4 mb-6`}>
              <h2 className={`text-2xl font-bold ${theme.text.primary}`}>{section}</h2>
            </div>
             <AiSectionSummary
                sectionName={section}
                sectionQuestions={sectionQuestions}
                sectionAnswers={sectionAnswers}
                destination={destination}
              />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {sectionQuestions.map(renderWidget)}
            </div>
          </section>
        );
      })}
      <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
        <p className="text-gray-300 whitespace-pre-wrap">{modalContent?.content}</p>
      </Modal>

      <Modal 
        isOpen={isSummaryModalOpen} 
        onClose={() => setIsSummaryModalOpen(false)} 
        title={`AI Sustainability Summary for ${destination}`}
      >
        {aiSummary ? <AiMarkdown text={aiSummary} /> : <p>Generating summary...</p>}
      </Modal>
    </div>
  );
};