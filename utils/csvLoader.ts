

import type { Metric, BcStrategy } from '../types';
import { parseCsv } from './csvParser';


const fetchCsv = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV from ${url}: ${response.statusText}`);
    }
    return response.text();
}

const metricIconMap: Record<string, string> = {
    'Destination Contact Information': 'https://res.cloudinary.com/glide/image/fetch/f_auto,w_150,h_150,c_lfill/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FPXgWhZmozHdFWj4kZSgR%2Fpub%2Fnmx4p93G68NTpJvtAuga.png',
    'Sustainability Management': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/Rb9VHNoAZvP0Fp6goeWd.png',
    'Tourism Satisfaction': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/yAuTZrn9Z1XkktypASDw.png',
    'Tourism Promotion': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/edU3fifUmAXIkjOlMUpJ.png',
    'Socio Economic Sustainability': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/k99jovz9ptfFYsD3zAX1.png',
    'Tourism Seasonality': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/sjRBn9mV5CwSFdkCxQ98.png',
    'Cultural Sustainability': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/WKMBJakR1NLdcN8neVW8.png',
    'Energy Management': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/kWJJN8Kgl65OlejSioeO.png',
    'Water Management': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/Comt2rCuuXDKexNUoMqr.png',
    'Waste Management': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/cWlrrlI5XP7UHzQSlQ60.png',
    'Land Management': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/C8qnw4t14SXnvxxw4gTy.png',
    'Building Design': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/euBcSn2MPEOA7p3MJ3TU.png',
    'Transportation': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/eVhM4ghlNg53SGX9B2Tn.png',
    'Plastic Reduction': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/vS4xdq9HVLOKvFJ2qPHt.png',
    'Organic & Hydroponic Foods': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/j7taAXuPj5B3ZFRHpbhH.png',
    'Sustainable Seafood': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/rlh98ABB20nbdPvuUkP1.png',
    'Habitat Protections': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/YvCBwSNJWMWFfavJ33qv.png',
    'Certified Clean Marinas': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/esf8duewEtc3bsjLE9Hl.png',
    'Education Programs': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/lnGxONemaCzx1Fe88tig.png',
    'Planetary Boundaries': 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/PXgWhZmozHdFWj4kZSgR/pub/6LLYFDjOn73uohJkJj3D.png',
};

// Specific data loaders
const loadMetricsData = async (): Promise<Metric[]> => {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSqiU1XRSWOGBeAs5weGjcPwDF3xT7YeqL8KP4YOTSF7SMqnOhYC68ziWXEpURPOGplxZFbW1Zafi39/pub?gid=897020073&single=true&output=csv';
    const csvText = await fetchCsv(url);
    const { rows } = parseCsv(csvText);
    // Map rows to Metric objects based on column index
    // FIX: Add explicit return type to the map callback to ensure correct type inference.
    return rows.map((row): Metric => {
        const name = row[0] || '';
        return {
            name: name,
            iconUrl: metricIconMap[name] || row[1] || '', // Use mapped icon, fallback to sheet icon
            relatedQuestions: row[6] || '', // Column G: Questions
            type: 'metric'
        }
    }).filter(metric => metric.name); // Filter out any empty rows
};

export const loadAllCsvData = async () => {
    const metrics = await loadMetricsData();
    return { metrics };
};