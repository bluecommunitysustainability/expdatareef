import type { Poi } from '../types';

const fetchCsv = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV from ${url}: ${response.statusText}`);
    }
    return response.text();
}

const parseCsv = (csvText: string): { headers: string[], rows: string[][] } => {
    const lines = csvText.trim().replace(/\r\n/g, '\n').split('\n');
    if (lines.length === 0) return { headers: [], rows: [] };
    const regex = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;
    const parseLine = (line: string): string[] => {
        const allMatches = Array.from(line.matchAll(regex));
        const values = allMatches.map(match => {
            if (match[1] !== undefined) return match[1].replace(/""/g, '"');
            if (match[2] !== undefined) return match[2];
            return '';
        });
        if (values.length > 0 && values[values.length - 1] === '' && !line.endsWith(',')) {
            return values.slice(0, -1);
        }
        return values;
    };
    const headers = parseLine(lines[0]).map(h => h.trim());
    const rows = lines.slice(1)
        .filter(line => line.trim() !== '')
        .map(line => {
            const parsedRow = parseLine(line).map(cell => cell.trim());
            while (parsedRow.length < headers.length) {
                parsedRow.push('');
            }
            return parsedRow;
        });
    return { headers, rows };
}

const isValidCategory = (category: string): category is Poi['category'] => {
    return ['Attraction', 'Park', 'Museum', 'Beach', 'Landmark', 'Shopping'].includes(category);
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

        const data = rows.slice(0, 7).reduce((acc, row) => {
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
                acc[destination].push({
                    name,
                    latitude,
                    longitude,
                    category,
                    description,
                    imageUrl: imageUrl || undefined,
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
