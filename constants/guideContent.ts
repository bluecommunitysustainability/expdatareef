export const guideContent: Record<string, string> = {
  'Contact Information': `
    <h4>Finding Key Contacts in <strong>{destination}</strong></h4>
    <p>The first step is to identify the main representative for tourism and sustainability. This data is usually public but can sometimes require a little digging.</p>
    <strong>Primary Sources:</strong>
    <ul>
      <li><strong>Official Tourism Website:</strong> This is the best starting point. Look for an "About Us", "Contact", or "Staff Directory" page. Search for titles like "Director of Tourism," "Sustainability Coordinator," or "Representative." Example search: <code>"official tourism website {destination}"</code>.</li>
      <li><strong>Local Government Website:</strong> Search for the official city or county website for <strong>{destination}</strong>. Departments to look for include the "Tourism Development Council," "Office of Sustainability," or "City Manager's Office."</li>
      <li><strong>Chamber of Commerce:</strong> The local Chamber of Commerce is an excellent resource for business and community leader contacts. Their website often has a staff directory. Search: <code>"{destination} Chamber of Commerce"</code>.</li>
    </ul>
    <strong>Tips:</strong>
    <p>If you can't find a direct person, a general contact email (like info@...) or phone number for the main tourism or government office is a great start. When uploading pictures, use high-resolution images that showcase the natural beauty and cultural assets of <strong>{destination}</strong>.</p>
  `,
  'Governance & Planning': `
    <h4>Locating Planning and Governance Documents</h4>
    <p>This section requires finding official public documents that outline the strategic direction for tourism and crisis management in <strong>{destination}</strong>.</p>
    <strong>Where to Look:</strong>
    <ul>
      <li><strong>Destination Management Plan (DMP):</strong> This is the most important document. Search the DMO or city/county website for <code>"{destination} Destination Management Plan"</code> or <code>"{destination} Tourism Master Plan"</code>. These multi-year strategies outline goals for sustainability and visitor management.</li>
      <li><strong>Risk & Crisis Plan:</strong> Search the county's "Emergency Management" or "Public Safety" department website. Key search terms: <code>"{destination} county emergency operations plan"</code> or <code>"crisis management plan"</code>.</li>
      <li><strong>Communication Strategies:</strong> Look within the DMP or DMO's annual reports for sections on "Stakeholder Communication" or "Industry Relations" to understand how sustainability is communicated.</li>
    </ul>
  `,
  'Stakeholder Engagement': `
    <h4>Assessing Community and Visitor Feedback Mechanisms</h4>
    <p>This involves looking for formal systems used by <strong>{destination}</strong> to gather feedback from both tourists and residents.</p>
    <ul>
      <li><strong>Visitor Surveys:</strong> The DMO for <strong>{destination}</strong> is the primary source. Look for "Visitor Satisfaction Survey" or "Visitor Sentiment Report" in their research or reports section. Many destinations use companies like STR or Longwoods International for this.</li>
      <li><strong>Resident Surveys:</strong> This is often conducted by the city or county government. Search for <code>"{destination} resident survey tourism"</code>. Results are often presented in public city council meetings. Check meeting agendas and minutes.</li>
      <li><strong>Feedback Channels:</strong> Examine the official tourism website and mobile apps for "Feedback" forms or review functionalities.</li>
    </ul>
  `,
  'Community & Economy': `
    <h4>Gathering Socio-Economic Data</h4>
    <p>This data combines local tourism reporting with national census data. Accuracy is key.</p>
    <ul>
      <li><strong>Population & Demographics:</strong> The most reliable source is the <a href="https://data.census.gov/" target="_blank" rel="noopener noreferrer">U.S. Census Bureau's American Community Survey</a>. You can search for <strong>{destination}</strong> by city or county to get population, employment, and demographic data.</li>
      <li><strong>Tourism Employment:</strong> Cross-reference DMO annual reports with data from the state's Department of Labor or Economic Opportunity. Search for <code>"tourism employment statistics {destination}"</code>.</li>
      <li><strong>Infrastructure & Services:</strong> Review the official city/county annual budget for <strong>{destination}</strong>. Look for capital improvement projects and social services funded by tourism-related taxes (e.g., Tourist Development Tax, Bed Tax).</li>
    </ul>
  `,
  'Labor & Human Rights': `
    <h4>Investigating Labor Practices and Social Equity</h4>
    <p>This requires looking at local wage data, ordinances, and social program information.</p>
    <ul>
      <li><strong>Living Wage:</strong> Use the <a href="https://livingwage.mit.edu/" target="_blank" rel="noopener noreferrer">MIT Living Wage Calculator</a> to find the living wage for the county of <strong>{destination}</strong>. Compare this to average hospitality wages from the <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer">Bureau of Labor Statistics (BLS)</a>.</li>
      <li><strong>Accessibility (ADA):</strong> Search the <strong>{destination}</strong> municipal code or building department website for "ADA compliance" or "accessibility standards."</li>
      <li><strong>Human Rights & Exploitation:</strong> Search for local ordinances related to human trafficking. Check websites of local non-profits focused on social justice or human rights in the <strong>{destination}</strong> area.</li>
    </ul>
  `,
  'Economic Performance': `
    <h4>Analyzing Tourism's Economic Impact</h4>
    <p>The Destination Marketing Organization (DMO) and local economic development agencies are the primary sources for this information.</p>
    <ul>
      <li><strong>Visitor Spending & Occupancy:</strong> The DMO for <strong>{destination}</strong> is the best source. Look for "Annual Report," "Visitor Statistics," or "Economic Impact Study." They will have data on hotel occupancy, average daily rate (ADR), and total visitor spending.</li>
      <li><strong>Business & Job Counts:</strong> Check with the <strong>{destination}</strong> Chamber of Commerce or the county's Economic Development Council. They often publish reports on the local business landscape. State-level Departments of Labor also provide detailed employment data by sector.</li>
    </ul>
  `,
  'Cultural Heritage': `
    <h4>Identifying Protections for Cultural Assets</h4>
    <p>Information is managed by historical societies, preservation offices, and cultural affairs departments.</p>
    <ul>
      <li><strong>Asset Protection:</strong> Search the <strong>{destination}</strong> city or county government website for a "Historic Preservation Board" or "Planning Department." Look for maps of historic districts and lists of designated local landmarks.</li>
      <li><strong>Artifact Laws:</strong> The State Historic Preservation Office (SHPO) website is the best source for state and federal laws like the National Historic Preservation Act (NHPA).</li>
      <li><strong>Intangible Heritage:</strong> Explore the websites of local arts councils, cultural centers, and event calendars for <strong>{destination}</strong>. They highlight local music, food festivals, and traditions.</li>
    </ul>
  `,
  'Energy Management': `
    <h4>Finding Data on Energy Consumption and Renewables</h4>
    <p>This data comes from utility providers and government sustainability or climate action plans.</p>
    <ul>
      <li><strong>Consumption Data:</strong> Identify the main electric utility provider for <strong>{destination}</strong> (e.g., Florida Power & Light, Duke Energy). On their website, look for "Sustainability Reports," "Annual Reports," or "Integrated Resource Plans (IRP)." These documents often contain data on the total energy delivered and the percentage generated from renewable sources.</li>
      <li><strong>GHG Emissions:</strong> Search the official city or county website for <strong>{destination}</strong> for a <code>"Climate Action Plan"</code> or <code>"Greenhouse Gas Inventory."</code> If unavailable locally, the EPA's <a href="https://www.epa.gov/ghgreporting" target="_blank" rel="noopener noreferrer">GHG Reporting Program</a> has data for large facilities.</li>
    </ul>
  `,
  'Water Management': `
    <h4>Sourcing Water Quality and Consumption Reports</h4>
    <p>Local water utilities and state environmental agencies are the best sources for this data.</p>
    <ul>
      <li><strong>Water Reports:</strong> The water department or utility for <strong>{destination}</strong> is legally required to publish an annual "Consumer Confidence Report" (CCR) on water quality. Search their website for this document. It will detail water sources, consumption, and quality testing results.</li>
      <li><strong>Water-borne Illnesses:</strong> Check the state's Department of Health website. They publish public health statistics, which are often searchable by county.</li>
      <li><strong>Reclaimed Water:</strong> The water utility's website or annual report is also the best source for data on water reclamation programs.</li>
    </ul>
  `,
  'Waste & Wastewater Management': `
    <h4>Tracking Waste and Recycling Data</h4>
    <p>This data is managed by the Public Works or Solid Waste Management department for <strong>{destination}</strong> or its surrounding county.</p>
    <ul>
      <li><strong>Waste Tonnage:</strong> Search for the "Solid Waste Authority" or "Public Works Department" for the county. They often publish annual reports with detailed data on total waste generated, tons recycled, and tons sent to landfill. Example search: <code>"{destination} county solid waste annual report"</code>.</li>
      <li><strong>Wastewater Treatment:</strong> This information is also typically found in reports from the Public Works or Water Resources department, sometimes within the annual water quality report (CCR).</li>
    </ul>
  `,
  'Land Use & Biodiversity': `
    <h4>Researching Land Planning and Conservation Efforts</h4>
    <p>City/county planning departments and state/federal conservation agencies are key for this information.</p>
    <ul>
      <li><strong>Land Use Plans:</strong> The primary document is the "Comprehensive Plan" or "Land Development Code," available on the <strong>{destination}</strong> city or county Planning and Zoning department website.</li>
      <li><strong>Conservation Areas:</strong> Use GIS maps from the state's Fish and Wildlife Conservation Commission (FWC) and Department of Environmental Protection (DEP). Local Parks and Recreation departments also provide this info.</li>
      <li><strong>Wildlife Laws:</strong> The FWC and the federal U.S. Fish and Wildlife Service (FWS) set the laws for wildlife interaction. Their websites are the definitive sources.</li>
    </ul>
  `,
  'Sustainable Construction': `
    <h4>Understanding Local Building Regulations</h4>
    <p>Building codes and planning department regulations govern sustainable construction practices.</p>
    <ul>
      <li><strong>Building Codes:</strong> Visit the <strong>{destination}</strong> "Building Department" or "Planning Department" website. Look for sections on the Florida Building Code, local amendments, and the environmental review process for new developments.</li>
      <li><strong>Green Building:</strong> Search for local chapters of the U.S. Green Building Council (USGBC) or programs like LEED and Florida Green Building Coalition for information on incentives and certified projects in <strong>{destination}</strong>.</li>
    </ul>
  `,
  'Transportation': `
    <h4>Finding Data on Mobility and Transit</h4>
    <p>This data is spread across local, regional, and state transportation agencies.</p>
    <ul>
      <li><strong>Mass Transit:</strong> Identify the local transit authority for <strong>{destination}</strong> (e.g., LYNX in Orlando, PSTA in Pinellas). Their websites publish ridership data, route maps, and annual reports.</li>
      <li><strong>Infrastructure:</strong> The <strong>{destination}</strong> Public Works Department website is the best source for maps and data on pedestrian trails and bicycle lanes.</li>
      <li><strong>Vehicle Data:</strong> The state's Department of Highway Safety and Motor Vehicles (DHSMV) provides annual statistical reports on vehicle registrations by county, which can be a good proxy.</li>
    </ul>
  `,
  'Waste Reduction (Plastics)': `
    <h4>Investigating Single-Use Plastic Policies</h4>
    <p>This is often driven by local ordinances and voluntary business initiatives.</p>
    <ul>
      <li><strong>Ordinances:</strong> Search the municipal code for <strong>{destination}</strong> for "plastic bag ban," "single-use plastics," or "straw ordinance."</li>
      <li><strong>Advocacy Groups:</strong> Check the websites of local environmental non-profits (e.g., Surfrider Foundation chapters), as they often lead and track these policies.</li>
      <li><strong>Business Programs:</strong> Look for programs like "Skip the Straw" or "Ocean Friendly Restaurants" in <strong>{destination}</strong>. The Chamber of Commerce or DMO may promote these.</li>
    </ul>
  `,
  'Local Food Sourcing': `
    <h4>Connecting with Local Agricultural Networks</h4>
    <p>Look for agricultural extension offices, farmers market associations, and state programs.</p>
    <ul>
      <li><strong>State Programs:</strong> The state's Department of Agriculture website often has programs like "Fresh From Florida" that promote local food sourcing and provide directories.</li>
      <li><strong>Local Markets:</strong> Search for <code>"{destination} farmers market"</code> or <code>"local food guide {destination}"</code> to find producers and cooperatives.</li>
      <li><strong>Academic Resources:</strong> University extension programs (e.g., UF/IFAS in Florida) are excellent resources for data on local agriculture and food systems.</li>
    </ul>
  `,
  'Seafood Sourcing': `
    <h4>Identifying Sustainable Seafood Practices</h4>
    <p>State marine agencies and sustainable seafood certification programs are primary sources.</p>
    <ul>
      <li><strong>Local Fisheries:</strong> The state's Fish and Wildlife or Marine Fisheries division website provides information on commercial fishing regulations, landing statistics, and local species.</li>
      <li><strong>Restaurant Programs:</strong> Look for restaurants in <strong>{destination}</strong> that are partners with national programs like the <a href="https://www.seafoodwatch.org/" target="_blank" rel="noopener noreferrer">Monterey Bay Aquarium's Seafood Watch</a> or local initiatives promoting sustainable seafood.</li>
    </ul>
  `,
  'Habitat & Species Protection': `
    <h4>Finding Data on Conservation Efforts</h4>
    <p>This data is held by parks departments, conservation land managers, and wildlife agencies.</p>
    <ul>
      <li><strong>Parks & Open Space:</strong> The <strong>{destination}</strong> Parks and Recreation department website will list public parks. The county property appraiser's website often has GIS maps showing land use, including conservation lands.</li>
      <li><strong>Endangered Species:</strong> The <a href="https://www.fws.gov/endangered" target="_blank" rel="noopener noreferrer">U.S. Fish and Wildlife Service (FWS)</a> maintains the definitive lists of threatened and endangered species, searchable by state and county.</li>
      <li><strong>Restoration Programs:</strong> Check the websites of local chapters of The Nature Conservancy, Audubon Society, or local watershed/estuary programs for specific projects in <strong>{destination}</strong>.</li>
    </ul>
  `,
  'Marinas': `
    <h4>Locating Marina Certifications and Counts</h4>
    <p>Information on marinas is available through marine industry associations and state environmental programs that certify them.</p>
    <ul>
      <li><strong>Clean Marina Program:</strong> The most direct source. Search for your state's "Clean Marina Program" (e.g., "Florida Clean Marina Program"). They maintain a public, searchable list of all certified marinas.</li>
      <li><strong>Directories:</strong> Online marina directories and nautical chart services can help you count the total number of marinas in the <strong>{destination}</strong> area to determine the percentage of certified facilities.</li>
    </ul>
  `,
  'Education & Awareness': `
    <h4>Identifying Local Environmental Education Providers</h4>
    <p>Look for environmental centers, aquariums, museums, and non-profits in <strong>{destination}</strong>.</p>
    <ul>
      <li><strong>Direct Search:</strong> Search for <code>"environmental education center {destination}"</code>, <code>"nature center {destination}"</code>, or <code>"science museum {destination}"</code>. Their annual reports or "About Us" pages often list visitor/participant numbers.</li>
      <li><strong>Institutional Partners:</strong> Local school district websites, colleges, and university outreach programs (like Sea Grant) may also have information on their sustainability education initiatives and partnerships within <strong>{destination}</strong>.</li>
    </ul>
  `,
  'Climate & Air Quality': `
    <h4>Sourcing Climate and Air Pollution Data</h4>
    <p>Federal and state environmental agencies are the most reliable sources for this technical data.</p>
    <ul>
      <li><strong>Air Quality:</strong> The EPA's official <a href="https://www.airnow.gov/" target="_blank" rel="noopener noreferrer">AirNow.gov</a> website is the best source. You can search by zip code for <strong>{destination}</strong> to find historical and real-time Air Quality Index (AQI) data.</li>
      <li><strong>Climate Plans:</strong> Search the <strong>{destination}</strong> municipal or county government website for a "Climate Action Plan," "Resilience Strategy," or "Sustainability Plan." These documents are the most likely source for carbon offset programs or net-zero carbon community goals.</li>
    </ul>
  `,
  'Environmental Protection': `
    <h4>Finding Local Environmental Ordinances</h4>
    <p>These policies are managed by state and local environmental departments and are often part of the municipal code.</p>
    <ul>
      <li><strong>Local Ordinances:</strong> The best source is the official government website for <strong>{destination}</strong>. Look for the "Code of Ordinances" or "Municipal Code." Search within this document for keywords like "fertilizer," "tree protection," "toxic," and "ecosystem."</li>
      <li><strong>State Agencies:</strong> The state's Department of Environmental Protection (DEP) or equivalent agency sets the overarching policies.</li>
      <li><strong>Water Districts:</strong> Regional Water Management Districts are key sources for policies on aquifer protection and water supply.</li>
    </ul>
  `,
  'Success Story': `
    <h4>Showcasing Positive Achievements</h4>
    <p>Success stories are promotional and should be easy to find through the destination's public-facing channels.</p>
    <ul>
      <li><strong>Press/News Room:</strong> Check the "Press Room" or "News" section of the <strong>{destination}</strong> DMO or tourism board website. They often highlight positive achievements and awards.</li>
      <li><strong>Local Media:</strong> Search local news outlets for positive stories related to "sustainable tourism," "conservation," or "community projects" in <strong>{destination}</strong>.</li>
      <li><strong>Awards:</strong> Look for sustainability awards won by <strong>{destination}</strong> itself or by major businesses within it (e.g., Florida Green Lodging certifications).</li>
    </ul>
  `
};