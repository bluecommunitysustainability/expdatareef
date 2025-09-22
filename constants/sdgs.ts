
import type { SdgInfo, SdgData } from '../types';

export const sdgData: SdgData[] = [
    { id: 1, name: "No Poverty", color: "#E5243B" },
    { id: 2, name: "Zero Hunger", color: "#DDA63A" },
    { id: 3, name: "Good Health and Well-being", color: "#4C9F38" },
    { id: 4, name: "Quality Education", color: "#C5192D" },
    { id: 5, name: "Gender Equality", color: "#FF3A21" },
    { id: 6, name: "Clean Water and Sanitation", color: "#26BDE2" },
    { id: 7, name: "Affordable and Clean Energy", color: "#FCC30B" },
    { id: 8, name: "Decent Work and Economic Growth", color: "#A21942" },
    { id: 9, name: "Industry, Innovation and Infrastructure", color: "#FD6925" },
    { id: 10, name: "Reduced Inequality", color: "#DD1367" },
    { id: 11, name: "Sustainable Cities and Communities", color: "#FD9D24" },
    { id: 12, name: "Responsible Consumption and Production", color: "#BF8B2E" },
    { id: 13, name: "Climate Action", color: "#3F7E44" },
    { id: 14, name: "Life Below Water", color: "#0A97D9" },
    { id: 15, name: "Life on Land", color: "#56C02B" },
    { id: 16, name: "Peace, Justice and Strong Institutions", color: "#00689D" },
    { id: 17, name: "Partnerships for the Goals", color: "#19486A" },
];

export const sdgMapping: Record<string, SdgInfo> = {
    // Governance & Planning
    'q13a': { sdgIds: [16], explanation: "Communicating sustainability concerns relates to building effective, accountable, and transparent institutions (16)." },
    'q14a': { sdgIds: [11, 12, 16], explanation: "Visitor management plans are key to sustainable cities (11), responsible consumption (12), and effective planning institutions (16)." },
    'q15a': { sdgIds: [11, 16], explanation: "Risk and crisis management plans contribute to safe and resilient communities (11) and are a function of strong institutions (16)." },
    // Stakeholder Engagement
    'q17a': { sdgIds: [16], explanation: "Providing opportunities for feedback supports responsive, inclusive, and participatory decision-making (16)." },
    'q18a': { sdgIds: [16], explanation: "Engaging stakeholders in management feedback strengthens institutions and promotes participatory governance (16)." },
    // Community & Economy
    'q21a': { sdgIds: [8, 11, 12], explanation: "Business sustainability plans support responsible production (12), decent work (8), and sustainable communities (11)." },
    'q23a': { sdgIds: [8], explanation: "Average room nights are a key indicator of tourism's contribution to local economic activity and decent work (8)." },
    'q24a': { sdgIds: [8, 11], explanation: "Peak tourist numbers inform infrastructure needs for sustainable cities (11) and pressures on local employment (8)." },
    'q25a': { sdgIds: [11], explanation: "The resident population is a baseline for measuring tourism's impact and planning for sustainable community growth (11)." },
    'q26a': { sdgIds: [8], explanation: "Measures direct employment in tourism, a core component of decent work and economic growth (8)." },
    'q29a': { sdgIds: [3, 9, 11], explanation: "Tracks how tourism contributes to community health (3), resilient infrastructure (9), and improved community services (11)." },
    'q30a': { sdgIds: [3, 11], explanation: "Initiatives to improve resident well-being directly support good health (3) and sustainable communities (11)." },
    'q31a': { sdgIds: [9, 11], explanation: "Measures tourism's contribution to building resilient infrastructure (9) for sustainable communities (11)." },
    'q32a': { sdgIds: [11], explanation: "Social services funded by tourism are a direct investment in creating sustainable and resilient communities (11)." },
    // Labor & Human Rights
    'q33a': { sdgIds: [4, 8], explanation: "Access to tourism training provides quality education (4) and supports skills for decent work and economic growth (8)." },
    'q34a': { sdgIds: [1, 8, 10], explanation: "Paying a living wage is critical for ending poverty (1), promoting decent work (8), and reducing economic inequality (10)." },
    'q35a': { sdgIds: [8, 17], explanation: "Incentives for local sourcing and sustainable investment foster partnerships (17) and support inclusive economic growth (8)." },
    'q36a': { sdgIds: [8, 17], explanation: "Encouraging contributions to sustainability initiatives builds partnerships (17) and promotes a sustainable economy (8)." },
    'q37a': { sdgIds: [5, 8, 16], explanation: "Upholding human rights protects against exploitation (8), promotes gender equality (5), and builds just and strong institutions (16)." },
    'q38a': { sdgIds: [10, 16], explanation: "Protecting property and resource rights prevents the dispossession of vulnerable groups, reducing inequality (10) and supporting rule of law (16)." },
    'q39a': { sdgIds: [3, 11, 16], explanation: "A system to monitor crime and health hazards ensures well-being (3), safe communities (11), and just institutions (16)." },
    'q40a': { sdgIds: [10, 11], explanation: "Ensuring accessibility for persons with disabilities reduces inequalities (10) and helps create inclusive and sustainable communities (11)." },
    // Economic Performance
    'q42a': { sdgIds: [8], explanation: "Measures economic diversification beyond tourism, which is important for resilient economic growth (8)." },
    'q43a': { sdgIds: [8], explanation: "The percentage of revenue from tourism quantifies its importance to the local economy and job creation (8)." },
    'q44a': { sdgIds: [8], explanation: "Monthly occupancy levels help understand seasonal employment patterns and their impact on decent work (8)." },
    'q45a': { sdgIds: [8], explanation: "Average annual occupancy is a key performance indicator for the tourism sector's contribution to economic growth (8)." },
    'q46a': { sdgIds: [8], explanation: "The number of enterprise establishments indicates the scale of economic activity and potential for job creation (8)." },
    'q47a': { sdgIds: [8], explanation: "Year-round establishments are crucial for providing stable, decent work rather than seasonal employment (8)." },
    'q48a': { sdgIds: [8], explanation: "Full-time, year-round jobs are a primary measure of stable and decent work within the local economy (8)." },
    'q49a': { sdgIds: [8], explanation: "Tracking temporary jobs helps assess the precarity of employment and the need for policies promoting decent work (8)." },
    // Cultural Heritage
    'q51a': { sdgIds: [11], explanation: "Conserving cultural assets is essential for making cities and human settlements inclusive, safe, resilient and sustainable (Target 11.4)." },
    'q52a': { sdgIds: [11, 16], explanation: "Laws protecting artifacts support the safeguarding of cultural heritage (11) and reflect the rule of law (16)." },
    'q53a': { sdgIds: [11], explanation: "Protecting intangible heritage (art, music, etc.) is vital for preserving cultural identity within sustainable communities (11)." },
    'q54a': { sdgIds: [11], explanation: "Ensuring community access to cultural sites is a key part of building inclusive and sustainable communities (11)." },
    'q55a': { sdgIds: [11], explanation: "Culturally appropriate information for visitors supports the safeguarding of local culture within sustainable tourism (11)." },
    'q56a': { sdgIds: [11, 16], explanation: "Protecting intellectual property rights supports cultural preservation (11) and just legal frameworks (16)." },
    'q57a': { sdgIds: [11], explanation: "Visitor management at cultural sites is crucial for protecting heritage while making cities sustainable (11)." },
    'q58a': { sdgIds: [11], explanation: "Accurate information for visitors helps protect cultural and natural heritage, contributing to sustainable communities (11)." },
    // Energy Management
    'q60a': { sdgIds: [7, 13], explanation: "Total energy consumption is a key metric for managing the transition to clean energy (7) and taking climate action (13)." },
    'q61a': { sdgIds: [7, 13], explanation: "Renewable energy generation directly supports affordable and clean energy (7) and climate change mitigation goals (13)." },
    'q62a': { sdgIds: [13], explanation: "Greenhouse gas emissions are a primary indicator for tracking progress on climate action (13)." },
    // Water Management
    'q64a': { sdgIds: [6, 12], explanation: "Freshwater consumption monitoring is vital for ensuring clean water access (6) and promoting responsible consumption (12)." },
    'q65a': { sdgIds: [6], explanation: "Water reclamation is a key strategy for ensuring the availability and sustainable management of water (6)." },
    'q66a': { sdgIds: [6], explanation: "Ensuring potable water standards in tourism establishments directly contributes to clean water and sanitation goals (6)." },
    'q67a': { sdgIds: [3, 6], explanation: "Monitoring water quality is essential for public health (3) and the sustainable management of water resources (6)." },
    'q68a': { sdgIds: [3, 6], explanation: "The frequency of water-borne diseases is a direct indicator of the effectiveness of water and sanitation systems (6) and their impact on public health (3)." },
    'q69a': { sdgIds: [6], explanation: "Per capita water use is a key metric for water efficiency and sustainable water management (6)." },
    // Waste & Wastewater Management
    'q71a': { sdgIds: [6, 14], explanation: "Sewage treatment prevents pollution, protecting both freshwater resources (6) and marine ecosystems (14)." },
    'q72a': { sdgIds: [6], explanation: "Use of sewage treatment systems in accommodations is crucial for achieving adequate and equitable sanitation for all (6)." },
    'q73a': { sdgIds: [11, 12], explanation: "Total waste production is a measure of a community's environmental footprint and its progress towards responsible consumption (12) and sustainable cities (11)." },
    'q74a': { sdgIds: [11, 12], explanation: "Recycling volume directly reflects efforts towards responsible consumption and production patterns (12) within cities (11)." },
    'q75a': { sdgIds: [11, 12], explanation: "Minimizing waste sent to landfill is a core target for achieving sustainable consumption (12) and reducing the environmental impact of cities (11)." },
    // Land Use & Biodiversity
    'q77a': { sdgIds: [11, 15], explanation: "Land use planning is fundamental to creating sustainable communities (11) and protecting terrestrial ecosystems (15)." },
    'q78a': { sdgIds: [11], explanation: "Controlling development density and design is a key tool for building sustainable and resilient cities (11)." },
    'q79a': { sdgIds: [15], explanation: "Land set aside for conservation is a direct measure of commitment to protecting terrestrial ecosystems and biodiversity (15)." },
    'q80a': { sdgIds: [15], explanation: "Plans to protect biodiversity are crucial for halting biodiversity loss and protecting life on land (15)." },
    'q81a': { sdgIds: [15], explanation: "Visitor management at natural sites helps minimize human impact and conserve terrestrial ecosystems (15)." },
    'q82a': { sdgIds: [15], explanation: "Ensuring compliance with wildlife interaction laws is essential for protecting biodiversity and preventing poaching and trafficking (15)." },
    // Sustainable Construction
    'q84a': { sdgIds: [11], explanation: "Environmental impact assessments for new construction help minimize the adverse environmental impact of cities (11)." },
    'q85a': { sdgIds: [7], explanation: "Energy efficiency standards for buildings are a key strategy for promoting clean and affordable energy (7)." },
    'q86a': { sdgIds: [11, 13], explanation: "Disaster reduction standards in construction help build resilient communities (11) and adapt to the impacts of climate change (13)." },
    'q87a': { sdgIds: [3, 11], explanation: "Minimizing light and noise pollution contributes to human well-being (3) and creates more sustainable urban environments (11)." },
    // Transportation
    'q89a': { sdgIds: [9, 11, 13], explanation: "Mass transit usage indicates sustainable infrastructure (9), lower emissions for climate action (13), and sustainable transport systems in cities (11)." },
    'q90a': { sdgIds: [3, 11, 13], explanation: "Bike trails promote good health (3), sustainable transport in cities (11), and reduced carbon emissions (13)." },
    'q91a': { sdgIds: [3, 11, 13], explanation: "Designated bike lanes support healthy lifestyles (3), sustainable urban mobility (11), and climate action through lower emissions (13)." },
    'q92a': { sdgIds: [3, 11, 13], explanation: "Pedestrian trails encourage walking, which benefits public health (3), creates sustainable communities (11), and reduces transport emissions (13)." },
    'q93a': { sdgIds: [13], explanation: "The number of vehicles is a proxy for transport emissions, a key factor in climate action (13)." },
    'q94a': { sdgIds: [13], explanation: "The adoption of energy-efficient vehicles is a direct measure of progress in reducing transport-related carbon emissions (13)." },
    // Waste Reduction (Plastics)
    'q96a': { sdgIds: [12], explanation: "Reducing single-use plastics is a direct action towards achieving sustainable consumption and production patterns (12)." },
    'q97a': { sdgIds: [12], explanation: "Refraining from using plastic straws contributes to the substantial reduction of waste generation (12)." },
    'q98a': { sdgIds: [12], explanation: "Eliminating plastic lids helps reduce overall waste, aligning with responsible consumption goals (12)." },
    // Local Food Sourcing
    'q100a': { sdgIds: [2, 11, 12], explanation: "Sourcing food locally supports sustainable agriculture (2), responsible consumption (12), and resilient local economies in communities (11)." },
    'q101a': { sdgIds: [12], explanation: "Composting food waste is a key strategy for reducing food losses and promoting responsible consumption (12)." },
    'q102a': { sdgIds: [12], explanation: "Farmers markets strengthen local supply chains and promote sustainable and responsible consumption patterns (12)." },
    // Seafood Sourcing
    'q104a': { sdgIds: [12, 14], explanation: "Sourcing seafood locally can support sustainable fishing practices (14) and responsible supply chains (12)." },
    'q105a': { sdgIds: [12, 14], explanation: "Tracking the percentage of local seafood promotes responsible consumption (12) and supports the sustainable use of marine resources (14)." },
    'q106a': { sdgIds: [12, 14], explanation: "Advertising local seafood raises consumer awareness and encourages sustainable choices (12), supporting marine life (14)." },
    // Habitat & Species Protection
    'q108a': { sdgIds: [15], explanation: "Habitat restoration programs are a direct action to protect, restore, and promote sustainable use of terrestrial ecosystems (15)." },
    'q109a': { sdgIds: [14, 15], explanation: "Programs to protect endangered species are critical for conserving life below water (14) and life on land (15)." },
    'q110a': { sdgIds: [15], explanation: "The percentage of land dedicated to parks is an indicator of a commitment to conserving terrestrial ecosystems (15)." },
    'q111a': { sdgIds: [15], explanation: "Tree planting programs contribute to reforestation and the restoration of degraded land, supporting life on land (15)." },
    // Marinas
    'q113a': { sdgIds: [14], explanation: "The number of marinas indicates the scale of boating activity and its potential impact on marine ecosystems (14)." },
    'q114a': { sdgIds: [14], explanation: "Clean Marina certifications show a commitment to preventing water pollution and protecting life below water (14)." },
    // Education & Awareness
    'q116a': { sdgIds: [4, 12, 13], explanation: "Sustainability education provides quality education (4) and raises awareness for responsible consumption (12) and climate action (13)." },
    'q117a': { sdgIds: [4], explanation: "Identifying organizations that provide sustainability education highlights resources for quality education (4) in the community." },
    // Climate & Air Quality
    'q119a': { sdgIds: [7, 13], explanation: "Policies for a net-zero carbon community are a primary strategy for climate action (13) and clean energy transition (7)." },
    'q120a': { sdgIds: [9, 13], explanation: "Encouraging mass transit reduces carbon emissions, contributing to climate action (13) and sustainable infrastructure (9)." },
    'q121a': { sdgIds: [13], explanation: "Offering carbon offsets for travel is a mechanism for taking urgent action to combat climate change (13)." },
    'q122a': { sdgIds: [13], explanation: "Carbon offsets for guest activities directly address the carbon footprint of tourism, supporting climate action (13)." },
    'q123a': { sdgIds: [12, 13], explanation: "Eliminating ozone-depleting substances supports responsible production (12) and global climate action efforts (13)." },
    'q124a': { sdgIds: [3, 13], explanation: "Policies to reduce air pollution protect public health (3) and are a key component of climate action (13)." },
    'q125a': { sdgIds: [3, 11, 13], explanation: "The Air Quality Index (AQI) is a direct measure of air pollution's impact on health (3), urban environments (11), and climate (13)." },
    'q126a': { sdgIds: [3, 13], explanation: "Tracking AQI highs and lows helps understand air pollution events that impact health (3) and relate to climate factors (13)." },
    // Environmental Protection
    'q127a': { sdgIds: [15], explanation: "Policies to protect ecosystems are fundamental to halting biodiversity loss and promoting the sustainable use of terrestrial ecosystems (15)." },
    'q128a': { sdgIds: [12], explanation: "Reducing toxic chemical use is a core part of achieving the environmentally sound management of chemicals and wastes (12)." },
    'q129a': { sdgIds: [6], explanation: "Protecting aquifer levels is essential for ensuring the availability and sustainable management of freshwater supplies (6)." },
    'q130a': { sdgIds: [13, 15], explanation: "Preventing tree loss and planting native trees helps combat desertification (15) and contributes to climate change mitigation (13)." },
    'q131a': { sdgIds: [14, 15], explanation: "Reducing fertilizer runoff is critical for preventing nutrient pollution in waterways, protecting both life on land (15) and below water (14)." },
    'q132a': { sdgIds: [15], explanation: "Plans to protect threatened species are a direct action to halt biodiversity loss and protect life on land (15)." },
    // Success Story
    'q133a': { sdgIds: [8], explanation: "Sustainable tourism success stories often highlight innovations that promote inclusive economic growth and decent work (8)." },
};
