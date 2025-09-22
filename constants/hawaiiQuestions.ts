import { Question, QuestionType } from '../types';

export const hawaiiQuestions: Question[] = [
  {
    id: 'q-aloha-1',
    section: 'Governance & Planning',
    text: 'Does {Destination} have a multi-year tourism strategy and action plan that is publicly available?',
    type: QuestionType.TEXTAREA,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-2',
    section: 'Governance & Planning',
    text: 'Is there an organization, department, group, or committee in {Destination} responsible for a coordinated approach to sustainable tourism?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-3',
    section: 'Governance & Planning',
    text: 'Does {Destination} have a system to monitor, publicly report, and respond to environmental, socio-economic, and cultural issues?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-4',
    section: 'Governance & Planning',
    text: 'Are there programs in {Destination} to encourage tourism enterprises to participate in sustainability?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-5',
    section: 'Governance & Planning',
    text: 'Does {Destination} have a mechanism to monitor and manage visitor movements and activities?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-6',
    section: 'Governance & Planning',
    text: 'Is there a resident sentiment survey on tourism in {Destination} that is publicly reported?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-7',
    section: 'Governance & Planning',
    text: 'Is there a visitor satisfaction survey on tourism in {Destination} that is publicly reported?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-8',
    section: 'Governance & Planning',
    text: 'Does {Destination} have planning guidelines, zoning and other land use regulations to protect natural and cultural heritage?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-9',
    section: 'Governance & Planning',
    text: 'Does {Destination} have laws and regulations regarding property acquisitions to protect access for the community to key resources?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-10',
    section: 'Governance & Planning',
    text: 'Does {Destination} have a system to monitor, prevent, publicly report, and respond to crime, safety, and health hazards?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-11',
    section: 'Governance & Planning',
    text: 'Does {Destination} have a crisis and emergency management plan?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-12',
    section: 'Economic Performance',
    text: 'What is the total visitor spending in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-13',
    section: 'Economic Performance',
    text: 'What percentage of total state visitor spending comes from {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-14',
    section: 'Economic Performance',
    text: 'What are the total arrivals to {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-15',
    section: 'Economic Performance',
    text: 'What are the average daily visitors to {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-16',
    section: 'Community & Economy',
    text: 'Does the tourism sector in {Destination} provide local and equal career opportunities and training?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-17',
    section: 'Community & Economy',
    text: 'Does {Destination} have a system that encourages public participation in planning and decision-making on an ongoing basis?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-18',
    section: 'Community & Economy',
    text: 'Is there a program in {Destination} to encourage tourism enterprises to purchase goods and services from local and sustainable providers?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-19',
    section: 'Community & Economy',
    text: 'Does {Destination} have laws, practices and a code of conduct to prevent and report human trafficking and exploitation?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-20',
    section: 'Cultural Heritage',
    text: 'Does {Destination} have a system to evaluate, rehabilitate and conserve cultural assets?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-21',
    section: 'Cultural Heritage',
    text: 'Does {Destination} have a visitor management system at cultural sites?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-22',
    section: 'Cultural Heritage',
    text: 'Does {Destination} have laws that govern the proper sale, trade, display or gifting of historical and archeological artifacts?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-23',
    section: 'Cultural Heritage',
    text: 'Is the protection of intangible cultural heritage (e.g. arts, music, language, gastronomy) supported in {Destination}?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-24',
    section: 'Cultural Heritage',
    text: 'Does {Destination} have a system to contribute to the protection and preservation of intellectual property rights of communities and individuals?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-25',
    section: 'Environmental Protection',
    text: 'Does {Destination} have a program to manage environmental risks?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-26',
    section: 'Environmental Protection',
    text: 'Does {Destination} have a system to protect sensitive environments and species?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-27',
    section: 'Environmental Protection',
    text: 'What is the total area of terrestrial protected areas in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-28',
    section: 'Environmental Protection',
    text: 'Does {Destination} have a visitor management system at natural sites?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-29',
    section: 'Environmental Protection',
    text: 'Does {Destination} have a system to ensure compliance with laws and standards for wildlife interactions?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-30',
    section: 'Climate & Air Quality',
    text: 'Are businesses and transport providers in {Destination} encouraged to reduce GHG emissions?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-31',
    section: 'Energy Management',
    text: 'Are businesses in {Destination} encouraged to reduce energy consumption?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-32',
    section: 'Energy Management',
    text: 'What is the total electricity sold in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-33',
    section: 'Energy Management',
    text: 'What percentage of electricity in {Destination} is generated from renewable sources?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-34',
    section: 'Water Management',
    text: 'Is water quality monitored in {Destination}?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-35',
    section: 'Water Management',
    text: 'Are businesses in {Destination} encouraged to reduce water consumption?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-36',
    section: 'Water Management',
    text: 'What is the total water consumption in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-37',
    section: 'Water Management',
    text: 'What is the average rainfall in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-38',
    section: 'Waste & Wastewater Management',
    text: 'Does {Destination} have a solid waste management system?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-39',
    section: 'Waste & Wastewater Management',
    text: 'What is the solid waste recycling rate in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-40',
    section: 'Waste & Wastewater Management',
    text: 'Does {Destination} have a system to manage wastewater?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-41',
    section: 'Environmental Protection',
    text: 'Does {Destination} have a system to reduce pollution from noise, light, runoff and erosion?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-42',
    section: 'Transportation',
    text: 'Does {Destination} have a system to increase the use of low-impact transportation?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-43',
    section: 'Transportation',
    text: 'What is the total number of registered vehicles in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-44',
    section: 'Transportation',
    text: 'What is the total number of electric vehicles in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-45',
    section: 'Transportation',
    text: 'What is the total number of bike lanes in {Destination} (in km)?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-46',
    section: 'Transportation',
    text: 'What is the total public transportation ridership in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-47',
    section: 'Transportation',
    text: 'What is the total number of airports in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-48',
    section: 'Transportation',
    text: 'What is the total number of harbors in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-49',
    section: 'Economic Performance',
    text: 'What is the total number of residents in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-50',
    section: 'Economic Performance',
    text: 'What is the unemployment rate in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-51',
    section: 'Economic Performance',
    text: 'What is the number of available jobs in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-52',
    section: 'Economic Performance',
    text: 'What is the median household income in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-53',
    section: 'Economic Performance',
    text: 'What is the number of residents below the poverty line in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-54',
    section: 'Economic Performance',
    text: 'What is the rate of homelessness in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-55',
    section: 'Economic Performance',
    text: 'What is the total number of housing units in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-56',
    section: 'Economic Performance',
    text: 'What is the cost of living index for {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-57',
    section: 'Economic Performance',
    text: 'What is the number of building permits issued in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-58',
    section: 'Community & Economy',
    text: 'What is the number of students enrolled in public schools in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-59',
    section: 'Community & Economy',
    text: 'What is the high school graduation rate in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-60',
    section: 'Community & Economy',
    text: 'What is the crime rate in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-61',
    section: 'Local Food Sourcing',
    text: 'What is the total agricultural land area in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-62',
    section: 'Local Food Sourcing',
    text: 'What is the market value of agricultural products sold in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-63',
    section: 'Local Food Sourcing',
    text: 'What is the number of farms in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-64',
    section: 'Cultural Heritage',
    text: 'What is the number of people who can speak the native language in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-65',
    section: 'Cultural Heritage',
    text: 'What is the number of students in native language immersion programs in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-66',
    section: 'Environmental Protection',
    text: 'What is the total land area of {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-67',
    section: 'Environmental Protection',
    text: 'What is the total number of endangered species in {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-68',
    section: 'Environmental Protection',
    text: 'What is the number of coral reefs near {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-69',
    section: 'Environmental Protection',
    text: 'What is the size of the coral reefs near {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-70',
    section: 'Climate & Air Quality',
    text: 'What are the CO2 emissions per capita in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-71',
    section: 'Climate & Air Quality',
    text: 'What is the average temperature in {Destination}?',
    type: QuestionType.TEXT,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-72',
    section: 'Environmental Protection',
    text: 'Does {Destination} have a watershed management plan?',
    type: QuestionType.BOOLEAN,
    badge: { text: 'Aloha', color: 'blue' }
  },
  {
    id: 'q-aloha-73',
    section: 'Environmental Protection',
    text: 'What is the number of beaches with poor water quality near {Destination}?',
    type: QuestionType.NUMBER,
    badge: { text: 'Aloha', color: 'blue' }
  }
];