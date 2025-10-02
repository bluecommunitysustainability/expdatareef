import { ai } from './geminiClient';
import { Type } from "@google/genai";
import type { Answers, Question, Poi, Tour } from '../types';
import { generateFullAnswerContext } from './aiHelper';

/**
 * Scans questionnaire answers for geographical place names and uses AI to geolocate them.
 */
export const scanAnswersForPois = async (answers: Answers, questions: Question[], destination: string): Promise<Omit<Poi, 'id' | 'status'>[]> => {
    const context = generateFullAnswerContext(questions, answers, destination);

    const prompt = `Scan the following sustainability assessment text for ${destination}. Identify any specific geographical locations, landmarks, parks, buildings, or addresses mentioned.
    For each location found, provide its name, a precise latitude, a longitude, and a brief one-sentence summary based on the context.
    Do not include the primary destination "${destination}" itself. Focus on specific places within or near it.
    
    Context:
    ${context}

    Return a JSON object with a key 'places' containing an array of these locations.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    places: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                latitude: { type: Type.NUMBER },
                                longitude: { type: Type.NUMBER },
                                summary: { type: Type.STRING }
                            },
                             required: ["name", "latitude", "longitude", "summary"]
                        }
                    }
                }
            }
        }
    });

    const result = JSON.parse(response.text.trim());
    if (result.places && Array.isArray(result.places)) {
        return result.places.map((place: any) => ({
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
            description: place.summary,
            category: 'AI Suggestion',
            isAiGenerated: true,
        }));
    }
    return [];
};


/**
 * Generates a tour route by getting a logical order from AI and then fetching the route from Mapbox.
 */
export const generateTourRoute = async (selectedPois: Poi[], tourType: 'walking' | 'transit' | 'driving', mapboxToken: string): Promise<Pick<Tour, 'routeGeoJson' | 'poiIds'>> => {
    if (selectedPois.length < 2) {
        throw new Error("Please select at least two points to create a tour.");
    }
    
    // Step 1: Ask AI for the optimal order
    const poiList = selectedPois.map(p => `ID: ${p.id}, Name: ${p.name}`).join('\n');
    const prompt = `You are a tour guide. Given the following points of interest, suggest a logical order for a ${tourType} tour. The tour should be efficient.
    
    Points of Interest:
    ${poiList}

    Return a JSON object with a key 'ordered_ids' containing an array of the POI IDs in the suggested order.`;

    const orderResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    ordered_ids: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });
    
    const orderResult = JSON.parse(orderResponse.text.trim());
    const orderedIds = orderResult.ordered_ids as string[];

    if (!orderedIds || orderedIds.length !== selectedPois.length) {
        throw new Error("AI could not determine a valid tour order.");
    }

    const orderedPois = orderedIds.map(id => selectedPois.find(p => p.id === id)).filter((p): p is Poi => !!p);

    // Step 2: Call Mapbox Directions API with the ordered points
    const mapboxProfile = tourType === 'transit' ? 'walking' : tourType; // Mapbox transit is complex, fallback to walking for now.
    const coordinatesString = orderedPois.map(p => `${p.longitude},${p.latitude}`).join(';');
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/${mapboxProfile}/${coordinatesString}?geometries=geojson&access_token=${mapboxToken}`;

    const routeResponse = await fetch(apiUrl);
    if (!routeResponse.ok) {
        throw new Error("Failed to fetch tour route from Mapbox Directions API.");
    }
    const routeData = await routeResponse.json();
    
    if (!routeData.routes || routeData.routes.length === 0) {
        throw new Error("No route could be found between the selected points.");
    }

    return {
        routeGeoJson: routeData.routes[0].geometry,
        poiIds: orderedIds,
    };
};