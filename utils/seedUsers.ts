import { saveUserProfile, loadUserProfile } from './database';
import type { UserProfile, Question } from '../types';
import type { Destination } from '../constants/destinations';
import { destinationObjects } from '../constants/destinations';

const adminUsers: Omit<UserProfile, 'apiKeys' | 'id'>[] = [
    { name: 'ChrisH', email: 'mr.christopher.harris@gmail.com', role: 'admin', activeModel: 'gemini', fontSize: 'md' },
    { name: 'ChrisL', email: 'atozenith@landsurveyorsunited.com', role: 'admin', activeModel: 'gemini', fontSize: 'md' },
    { name: 'Blue Community', email: 'blue.community.info@gmail.com', role: 'admin', activeModel: 'gemini', fontSize: 'md' },
];

const sectionAbbreviations: Record<string, string> = {
    'Contact Information': 'contact',
    'Governance & Planning': 'gov',
    'Stakeholder Engagement': 'stakeholder',
    'Community & Economy': 'community',
    'Labor & Human Rights': 'labor',
    'Economic Performance': 'econ',
    'Cultural Heritage': 'culture',
    'Energy Management': 'energy',
    'Water Management': 'water',
    'Waste & Wastewater Management': 'waste',
    'Land Use & Biodiversity': 'land',
    'Sustainable Construction': 'construct',
    'Transportation': 'transport',
    'Waste Reduction (Plastics)': 'plastics',
    'Local Food Sourcing': 'food',
    'Seafood Sourcing': 'seafood',
    'Habitat & Species Protection': 'habitat',
    'Marinas': 'marinas',
    'Education & Awareness': 'edu',
    'Climate & Air Quality': 'climate',
    'Environmental Protection': 'env',
    'Success Story': 'success'
};

// Assigns 2-3 sections to each of the 10 monitor slots
const monitorAssignments = [
    ['Governance & Planning', 'Stakeholder Engagement', 'Community & Economy'],
    ['Labor & Human Rights', 'Economic Performance'],
    ['Cultural Heritage', 'Energy Management', 'Water Management'],
    ['Waste & Wastewater Management', 'Land Use & Biodiversity'],
    ['Sustainable Construction', 'Transportation'],
    ['Waste Reduction (Plastics)', 'Local Food Sourcing', 'Seafood Sourcing'],
    ['Habitat & Species Protection', 'Marinas'],
    ['Education & Awareness', 'Climate & Air Quality'],
    ['Environmental Protection', 'Success Story'],
    ['Contact Information', 'Governance & Planning'] 
];

const generateMonitorsForDestination = (destination: Destination): Omit<UserProfile, 'apiKeys' | 'id'>[] => {
    const monitors: Omit<UserProfile, 'apiKeys' | 'id'>[] = [];
    const destNameClean = destination.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    monitorAssignments.forEach((assignedSections, index) => {
        const firstSectionAbbr = sectionAbbreviations[assignedSections[0]] || `s${index}`;
        const email = `${destNameClean}${firstSectionAbbr}@bluecommunity.info`;
        monitors.push({
            name: `${destination.name} Monitor ${index + 1}`,
            email: email,
            role: 'Monitor',
            team: destination.name,
            editableSections: assignedSections,
            title: `${assignedSections.join(', ')} Monitor`,
            expertise: `Specializing in ${assignedSections.join(' and ')} for ${destination.name}.`,
            activeModel: 'gemini',
            fontSize: 'md',
        });
    });
    return monitors;
};

export const seedMonitorsForDestination = async (destination: Destination) => {
    const monitorsToSeed = generateMonitorsForDestination(destination);
    for (const monitorData of monitorsToSeed) {
        const existingUser = await loadUserProfile(monitorData.email);
        if (!existingUser) {
            const newUserProfile: UserProfile = {
                ...monitorData,
                id: monitorData.email,
                apiKeys: { gemini: '', openai: '', claude: '', mapbox: '' },
            };
            await saveUserProfile(newUserProfile);
            console.log(`Seeded new monitor for ${destination.name}: ${monitorData.email}`);
        }
    }
}


export const seedInitialUsers = async () => {
    let allUsersToSeed: Omit<UserProfile, 'apiKeys' | 'id'>[] = [...adminUsers];

    // Generate monitor users for each destination
    destinationObjects.forEach(destination => {
        allUsersToSeed = allUsersToSeed.concat(generateMonitorsForDestination(destination));
    });

    // Check and save each user only if they don't already exist
    for (const userData of allUsersToSeed) {
        const existingUser = await loadUserProfile(userData.email);
        if (!existingUser) {
            const newUserProfile: UserProfile = {
                ...userData,
                id: userData.email,
                apiKeys: { gemini: '', openai: '', claude: '', mapbox: '' },
            };
            await saveUserProfile(newUserProfile);
            console.log(`Seeded user: ${userData.email}`);
        }
    }
};