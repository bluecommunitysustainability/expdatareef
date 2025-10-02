import type { Metric } from '../types';
import { parseCsv } from './csvParser';

const fetchCsv = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV from ${url}: ${response.statusText}`);
    }
    return response.text();
}

// Loads the 20 metric groups from the specified Google Sheet.
const loadMetricsData = async (): Promise<Metric[]> => {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQzPJ-9m9OeNiR-GkHc1hEldsjkVP0MWYJTU7VwN4LF-HTjp_hjPgLuaSdlHvFE2OegdM3Ndwu3NLkP/pub?gid=0&single=true&output=csv';
    try {
        const csvText = await fetchCsv(url);
        const { rows } = parseCsv(csvText);

        // Expects CSV columns in order: Metric Group, Icon Image, Questions, Question Numbers
        return rows.map((row): Metric | null => {
            // Ensure the row has at least the name and icon URL to be considered valid.
            if (row && row.length >= 2 && row[0] && row[1]) {
                return {
                    type: 'metric',
                    name: row[0].trim() || '',
                    iconUrl: row[1].trim() || '',
                    relatedQuestions: row[2] ? row[2].trim() : '',
                    questionNumbers: row[3] ? row[3].trim() : '',
                };
            }
            return null;
        }).filter((metric): metric is Metric => metric !== null); // Filter out any null/malformed rows
    } catch (error) {
        console.error("Failed to load or parse metrics data:", error);
        return []; // Return an empty array on error to prevent crashes
    }
};

// This function aggregates all data needed for the Info Hub.
export const loadAllCsvData = async () => {
    const metrics = await loadMetricsData();
    return { metrics };
};