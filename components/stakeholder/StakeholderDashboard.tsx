
import React, { useState, useMemo, useEffect } from 'react';
import { destinations } from '../../constants/destinations';
import { stakeholderBackgroundImages } from '../../constants/stakeholderImages';
import type { Answers, Question, SectionTimestamps, AnswerObject } from '../../types';
import { ProgressBar } from '../ProgressBar';
import { StakeholderCard } from './StakeholderCard';
import { MetricDetailPanel } from './MetricDetailPanel';
import { ReportButton } from './ReportButton';
import { exportStakeholderToXLSX } from '../../utils/exporters';
import { AiSectionSummary } from './AiSectionSummary';

interface StakeholderDashboardProps {
  questions: Question[];
  answers: Answers;
  initialDestination: string;
  sectionTimestamps: SectionTimestamps;
  onDestinationChange: (destination: string) => void;
}

export const StakeholderDashboard: React.FC<StakeholderDashboardProps> = ({
  questions,
  answers,
  initialDestination,
  sectionTimestamps,
  onDestinationChange
}) => {
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [metricGroup, setMetricGroup] = useState('ALL');
  const [selectedMetric, setSelectedMetric] = useState<{ q: Question; a: AnswerObject | null } | null>(null);

  useEffect(() => {
    setSelectedDestination(initialDestination);
  }, [initialDestination]);

  const backgroundImage = stakeholderBackgroundImages[selectedDestination] || stakeholderBackgroundImages['default'];

  const { questionsBySection, orderedSections, metricGroups } = useMemo(() => {
    const sections: Record<string, Question[]> = {};
    const order: string[] = [];
    questions.forEach(q => {
      if (!sections[q.section]) {
        sections[q.section] = [];
        order.push(q.section);
      }
      sections[q.section].push(q);
    });
    return { 
      questionsBySection: sections, 
      orderedSections: order,
      metricGroups: ['ALL', ...order]
    };
  }, [questions]);

  const sectionsToRender = useMemo(() => {
    if (metricGroup === 'ALL') {
      return orderedSections;
    }
    return orderedSections.filter(s => s === metricGroup);
  }, [metricGroup, orderedSections]);

  const { completed, total } = useMemo(() => {
    const totalMetrics = questions.length;
    const completedMetrics = Object.values(answers).filter(a => a.value !== null && a.value !== '' && a.value !== undefined).length;
    return { completed: completedMetrics, total: totalMetrics };
  }, [questions, answers]);

  const handleGenerateReport = () => {
    const metricsToExport = metricGroup === 'ALL' ? questions : questions.filter(q => q.section === metricGroup);
    exportStakeholderToXLSX(metricsToExport, answers, selectedDestination, sectionTimestamps, metricGroup);
  };
  
  return (
    <div className="h-screen w-full flex flex-col relative text-gray-800">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 flex flex-col h-full">
        {/* Top Bar */}
        <header className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-md border border-gray-200/50">
           <div className="flex justify-between items-center flex-wrap gap-4">
               <h1 className="text-2xl font-bold text-gray-900">Stakeholder Dashboard for {selectedDestination}</h1>
               <div className="flex items-center gap-4 flex-wrap">
                   <select
                       value={selectedDestination}
                       onChange={e => onDestinationChange(e.target.value)}
                       className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                       {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                   <select
                       value={metricGroup}
                       onChange={e => setMetricGroup(e.target.value)}
                       className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                       {metricGroups.map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
               </div>
           </div>
           <div className="mt-4">
               <ProgressBar completed={completed} total={total} />
           </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto mt-6 pr-2 -mr-2 space-y-8">
            {sectionsToRender.map(section => {
              const sectionQuestions = questionsBySection[section];
              const sectionAnswers = sectionQuestions.reduce((acc, q) => {
                if (answers[q.id]) {
                  acc[q.id] = answers[q.id];
                }
                return acc;
              }, {} as Answers);

              return (
                <section key={section} className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-3 mb-4">{section}</h2>
                  <AiSectionSummary 
                    sectionName={section}
                    sectionQuestions={sectionQuestions}
                    sectionAnswers={sectionAnswers}
                    destination={selectedDestination}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                      {sectionQuestions.map(q => (
                          <StakeholderCard 
                              key={q.id}
                              question={q}
                              answer={answers[q.id] ?? null}
                              timestamp={sectionTimestamps[q.section]}
                              onOpenDetail={() => setSelectedMetric({ q, a: answers[q.id] ?? null })}
                          />
                      ))}
                  </div>
                </section>
              );
            })}
             {sectionsToRender.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-white/70 p-8 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700">No Data Available</h3>
                        <p className="text-gray-500 mt-2">No completed metrics match the current filter.</p>
                    </div>
                </div>
            )}
        </main>
      </div>
      
      <MetricDetailPanel 
        metric={selectedMetric}
        onClose={() => setSelectedMetric(null)}
      />
      
      <ReportButton onGenerateReport={handleGenerateReport} />
    </div>
  );
};
