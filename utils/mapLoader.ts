import type { Poi } from '../types';
import { parseCsv } from './csvParser';

const fetchCsv = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV from ${url}: ${response.statusText}`);
    }
    return response.text();
}

const isValidCategory = (category: string): category is Poi['category'] => {
    return ['Attraction', 'Park', 'Museum', 'Beach', 'Landmark', 'Shopping', 'AI Suggestion'].includes(category);
};

export const loadMapData = async (): Promise<Record<string, Poi[]>> => {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSqiU1XRSWOGBeAs5weGjcPwDF3xT7YeqL8KP4YOTSF7SMqnOhYC68ziWXEpURPOGplxZFbW1Zafi39/pub?gid=1787173070&single=true&output=csv';
    try {
        const csvText = await fetchCsv(url);
        const { headers, rows } = parseCsv(csvText);
        
        const destinationHeader = headers.indexOf('Destination');
        const nameHeader = headers.indexOf('Name');
        const latHeader = headers.indexOf('Latitude');
        const lonHeader = headers.indexOf('Longitude');
        const catHeader = headers.indexOf('Category');
        const descHeader = headers.indexOf('Description');
        const imgHeader = headers.indexOf('Image URL');

        const data = rows.slice(0, 7).reduce((acc, row, index) => {
            const destination = row[destinationHeader];
            const name = row[nameHeader];
            const latitude = parseFloat(row[latHeader]);
            const longitude = parseFloat(row[lonHeader]);
            const category = row[catHeader];
            const description = row[descHeader];
            const imageUrl = row[imgHeader];

            if (destination && name && !isNaN(latitude) && !isNaN(longitude) && isValidCategory(category)) {
                if (!acc[destination]) {
                    acc[destination] = [];
                }
                // FIX: Add missing properties to conform to the 'Poi' type.
                acc[destination].push({
                    id: `${destination.replace(/\s+/g, '-').toLowerCase()}-${index}`,
                    name,
                    latitude,
                    longitude,
                    category,
                    description,
                    imageUrl: imageUrl || undefined,
                    status: 'published',
                    isAiGenerated: false
                });
            }
            return acc;
        }, {} as Record<string, Poi[]>);

        return data;
    } catch (error) {
        console.error("Failed to load map data:", error);
        return {}; // Return empty object on failure
    }
};