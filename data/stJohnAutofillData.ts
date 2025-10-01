import type { Answers } from '../types';

const stJohnAnswers: Answers = {
  'q14a': { value: true, source: 'https://www.nps.gov/viis/planyourvisit/conditions.htm', aiGenerated: true },
  'q25a': { value: 3881, source: 'https://www.census.gov/data/tables/2020/dec/2020-us-virgin-islands.html', aiGenerated: true },
  'q60a': { value: 500000000, source: 'https://www.viwapa.vi/docs/default-source/default-document-library/integrated-resource-plan-(irp)/2020-viwapa-irp-final-report.pdf', aiGenerated: true },
  'q61a': { value: 5000000, source: 'https://www.viwapa.vi/docs/default-source/default-document-library/integrated-resource-plan-(irp)/2020-viwapa-irp-final-report.pdf', aiGenerated: true },
  'q73a': { value: 2800, source: 'https://www.viwma.org/', aiGenerated: true },
  'q74a': { value: 200, source: 'https://islandgreenliving.org/recycling-composting/', aiGenerated: true },
  'q75a': { value: 2600, source: 'https://www.viwma.org/', aiGenerated: true },
  'q79a': { value: 60, source: 'https://www.nps.gov/viis/index.htm', aiGenerated: true },
  'q80a': { value: true, source: 'https://www.nps.gov/viis/learn/management/index.htm', aiGenerated: true },
  'q90a': { value: 0, source: 'https://www.nps.gov/viis/planyourvisit/hiking-in-paradise.htm', aiGenerated: true },
  'q92a': { value: 32, source: 'https://www.nps.gov/viis/planyourvisit/hiking-in-paradise.htm', aiGenerated: true },
  'q110a': { value: 60, source: 'https://www.nps.gov/viis/index.htm', aiGenerated: true },
  'q113a': { value: 4, source: 'https://www.vinow.com/stjohn/marinas/', aiGenerated: true },
  'q-aloha-14': { value: 480000, source: 'https://www.usviber.org/visitors-reports/', aiGenerated: true },
  'q-aloha-27': { value: 2937, source: 'https://www.nps.gov/viis/faqs.htm', aiGenerated: true },
  'q-aloha-47': { value: 0, source: 'https://www.vinow.com/travel/getting-to-the-virgin-islands/', aiGenerated: true },
  'q-aloha-49': { value: 3881, source: 'https://www.census.gov/data/tables/2020/dec/2020-us-virgin-islands.html', aiGenerated: true },
  'q-aloha-55': { value: 3118, source: 'https://www.census.gov/data/tables/2020/dec/2020-us-virgin-islands.html', aiGenerated: true },
  'q-aloha-63': { value: 19, source: 'https://www.nass.usda.gov/Publications/AgCensus/2017/Online_Resources/Ag_Atlas_Maps/virgin_islands.php', aiGenerated: true },
  'q-aloha-73': { value: 1, source: 'https://dpnr.vi.gov/environmental-protection/', aiGenerated: true }
};

export const getStJohnAnswers = (): Answers => {
  return stJohnAnswers;
};
