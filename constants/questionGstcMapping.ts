/**
 * This mapping connects a question ID from `questions.ts` to one or more
 * GSTC criteria IDs from `gstcCriteria.ts`. This is used to provide
 * contextual information in tooltips and other UI elements.
 */
export const questionGstcMapping: Record<string, string[]> = {
  // Governance & Planning
  'q12a': ['A7'], 
  'q13a': ['A4'], 
  'q14a': ['A9'], 
  'q14b': ['A9'],
  'q15a': ['A13'], 
  'q15b': ['A13'],
  // Stakeholder Engagement
  'q17a': ['A6'], 
  'q17b': ['A6'],
  'q18a': ['A5'], 
  'q18b': ['A5'],
  // Community & Economy
  'q21a': ['A4', 'B1'],
  'q23a': ['B1'],
  'q24a': ['B1', 'A9'],
  'q25a': ['B1'],
  'q26a': ['B2'], 
  'q29a': ['B4'], 
  'q30a': ['B4'],
  'q31a': ['B4'],
  'q32a': ['B4'],
  // Labor & Human Rights
  'q33a': ['B2'],
  'q34a': ['B2'],
  'q35a': ['B5'], 
  'q36a': ['B4'],
  'q37a': ['B6'], 
  'q38a': ['A11'], 
  'q39a': ['A12'], 
  'q40a': ['A10'], 
  // Economic Performance
  'q42a': ['B1'],
  'q43a': ['B1'],
  'q44a': ['B1'],
  'q45a': ['B1'],
  'q46a': ['B7'], 
  'q47a': ['B7'],
  'q48a': ['B2'],
  'q49a': ['B2'],
  // Cultural Heritage
  'q51a': ['C1'],
  'q52a': ['C4'],
  'q53a': ['C5'],
  'q54a': ['C1', 'C3'],
  'q55a': ['C2'],
  'q56a': ['C6'],
  'q57a': ['C3'],
  'q58a': ['C2'],
  // Energy Management
  'q60a': ['D6'],
  'q61a': ['D6'],
  'q62a': ['D5'],
  // Water Management
  'q64a': ['D7', 'D8'],
  'q65a': ['D7'],
  'q66a': ['D7'],
  'q67a': ['D7'],
  'q68a': ['D7'],
  'q69a': ['D8'],
  // Waste & Wastewater Management
  'q71a': ['D10'],
  'q72a': ['D10'],
  'q73a': ['D9'],
  'q74a': ['D9'],
  'q75a': ['D9'],
  // Land Use & Biodiversity
  'q77a': ['A8'],
  'q78a': ['A8'],
  'q79a': ['D2'],
  'q80a': ['D2'],
  'q81a': ['D3'],
  'q82a': ['D4'],
  // Sustainable Construction
  'q84a': ['A8'],
  'q85a': ['D6'],
  'q86a': ['A13'],
  'q87a': ['D11'],
  // Transportation
  'q89a': ['D12'],
  'q90a': ['D12'],
  'q91a': ['D12'],
  'q92a': ['D12'],
  'q94a': ['D5'],
  // Waste Reduction (Plastics)
  'q96a': ['D9'],
  'q97a': ['D9'],
  'q98a': ['D9'],
  // Local Food Sourcing
  'q100a': ['B5'],
  'q101a': ['D9'],
  'q102a': ['B5'],
  // Seafood Sourcing
  'q104a': ['B5', 'D4'],
  'q105a': ['B5', 'D4'],
  'q106a': ['B5', 'D4'],
  // Habitat & Species Protection
  'q108a': ['D2'],
  'q109a': ['D2', 'D4'],
  'q110a': ['D2'],
  'q111a': ['D2'],
  // Marinas
  'q114a': ['D7'],
  // Education & Awareness
  'q116a': ['A4'],
  'q117a': ['A4'],
  // Climate & Air Quality
  'q119a': ['D5'],
  'q120a': ['D12'],
  'q121a': ['D5'],
  'q122a': ['D5'],
  'q123a': ['D11'],
  'q124a': ['D11'],
  'q125a': ['D11'],
  'q126a': ['D11'],
  // Environmental Protection
  'q127a': ['D2'],
  'q128a': ['D11'],
  'q129a': ['D7'],
  'q130a': ['D2'],
  'q131a': ['D11'],
  'q132a': ['D2', 'D4'],
};
