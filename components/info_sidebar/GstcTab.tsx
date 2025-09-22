
import React, { useState, useMemo } from 'react';
// FIX: Import GstcCriterionDetail type from the correct file.
import type { GstcCriterionDetail } from '../../types';
import { Accordion } from '../sidebar/Accordion';
import { GstcModal } from './GstcModal';

interface GstcTabProps {
  data: GstcCriterionDetail[];
}

export const GstcTab: React.FC<GstcTabProps> = ({ data }) => {
  const [selectedCriterion, setSelectedCriterion] = useState<GstcCriterionDetail | null>(null);

  const criteriaBySection = useMemo(() => {
    return data.reduce((acc, criterion) => {
      const title = `Section ${criterion.section}: ${criterion.sectionTitle}`;
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(criterion);
      return acc;
    }, {} as Record<string, GstcCriterionDetail[]>);
  }, [data]);

  const handleCardClick = (criterion: GstcCriterionDetail) => {
    setSelectedCriterion(criterion);
  };

  const handleCloseModal = () => {
    setSelectedCriterion(null);
  };

  return (
    <>
      <div className="space-y-1">
        {Object.entries(criteriaBySection).map(([sectionTitle, criteria]) => (
          <Accordion key={sectionTitle} title={sectionTitle} startOpen={sectionTitle.startsWith('Section A')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2 px-1">
              {criteria.map(criterion => (
                <button
                  key={criterion.id}
                  onClick={() => handleCardClick(criterion)}
                  className="bg-gray-100 text-gray-900 p-3 rounded-md shadow-sm hover:shadow-lg hover:ring-2 hover:ring-teal-400 transition-all text-left w-full"
                >
                  <h4 className="font-bold text-sm">
                    <span className="font-mono">{criterion.id}</span> - {criterion.title}
                  </h4>
                </button>
              ))}
            </div>
          </Accordion>
        ))}
      </div>
      <GstcModal
        isOpen={!!selectedCriterion}
        onClose={handleCloseModal}
        criterion={selectedCriterion}
      />
    </>
  );
};
