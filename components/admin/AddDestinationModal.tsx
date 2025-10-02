import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { useTheme } from '../../context/ThemeContext';
import type { Destination } from '../../constants/destinations';
import { ai } from '../../utils/geminiClient';
import { Type } from "@google/genai";
import { availableThemes } from '../../constants/teamColors';
import type { ApiKeys } from '../../types';

interface AddDestinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddDestination: (newDestination: Destination) => Promise<void>;
    mapboxToken: string;
    apiKeys: ApiKeys;
}

const steps = ["Details", "Team", "Questions", "Users", "Image Gen"];

export const AddDestinationModal: React.FC<AddDestinationModalProps> = ({ isOpen, onClose, onAddDestination, mapboxToken, apiKeys }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Step 1 State
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    
    // Step 2 State
    const [color, setColor] = useState('');
    const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
    
    // Final Destination Object
    const [newDestination, setNewDestination] = useState<Partial<Destination>>({});

    useEffect(() => {
        if (!isOpen) {
            // Reset state on close
            setActiveStep(0);
            setIsLoading(false);
            setError('');
            setName('');
            setLocation('');
            setColor('');
            setSuggestedColors([]);
            setNewDestination({});
        }
    }, [isOpen]);

    const handleNext = async () => {
        setError('');
        setIsLoading(true);

        if (activeStep === 0) { // Details -> Geocoding
            if (!name || !location) {
                setError("Please provide both a name and a location.");
                setIsLoading(false);
                return;
            }
             if (!mapboxToken) {
                setError("Geocoding failed: Mapbox Token is missing. Please add it in the settings panel.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxToken}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    const [longitude, latitude] = data.features[0].center;
                    setNewDestination({ id: Date.now(), name, latitude, longitude, zoom: 10 });
                    setActiveStep(1);
                } else {
                    setError("Could not find coordinates. Please check the location spelling or be more specific.");
                }
            } catch (err) {
                 const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                if (errorMessage.includes("Invalid Token")) {
                    setError("Geocoding failed: Invalid Mapbox Token. Please check your token in the settings panel.");
                } else {
                    setError(`Geocoding failed: ${errorMessage}`);
                }
            }
        } else if (activeStep === 1) { // Team -> AI Color Suggestions
             if (!color) {
                setError("Please select a team color.");
                setIsLoading(false);
                return;
            }
            setNewDestination(prev => ({ ...prev, color }));
            setActiveStep(2);

        } else if (activeStep === 4) { // Image Gen
             if (!newDestination.name || !color) return;
             if (!apiKeys.gemini) {
                setError("Image Generation failed: Gemini API Key is missing. Please add it in the settings panel.");
                setIsLoading(false);
                return;
            }
            try {
                const prompt = `An award-winning, vibrant, high-resolution aerial photograph of ${newDestination.name}, as if looking out of an airplane window while coming in to land. The view should be beautiful, clear, and iconic.`;
                const imageResponse = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' }
                });
                const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                const finalDestination = { ...newDestination, color, backgroundImage: imageUrl } as Destination;
                await onAddDestination(finalDestination);
                onClose();
            } catch (err) {
                 setError("Failed to generate image. You can add one later. Click Finish to skip.");
                 console.error(err);
            }
        } else {
            setActiveStep(prev => prev + 1);
        }
        setIsLoading(false);
    };
    
    const handleSuggestColors = async () => {
        if (!newDestination.name) return;
        setIsLoading(true);
        setError('');
        try {
            const firstLetter = newDestination.name.charAt(0).toUpperCase();
            const prompt = `Suggest 3-5 color names that start with the letter "${firstLetter}" and would look good as an accent color on a dark user interface (dark blue/gray background). The colors should have good contrast. Examples: "Teal", "Amber", "Indigo".
            Return ONLY a JSON object with a single key "colors" containing an array of color names.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { colors: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
            });
            const result = JSON.parse(response.text.trim());
            const suggestions = availableThemes.filter(t => result.colors.some((c: string) => t.name.toLowerCase() === c.toLowerCase())).map(t => t.value);
            setSuggestedColors(suggestions.length > 0 ? suggestions : ['teal', 'blue', 'orange']); // Fallback
        } catch (err) {
            setError("AI color suggestion failed. Please choose manually.");
            setSuggestedColors(['teal', 'blue', 'orange', 'red', 'green']);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setError('');
        if (activeStep > 0) setActiveStep(prev => prev - 1);
    };
    
    const handleSkipImage = async () => {
        if (!newDestination.name || !color) return;
        const finalDestination = { ...newDestination, color } as Destination;
        await onAddDestination(finalDestination);
        onClose();
    }

    const renderStepContent = () => {
        switch (activeStep) {
            case 0: return (
                <div>
                    <label htmlFor="dest-name" className="block text-sm font-medium text-gray-300 mb-1">Destination Name</label>
                    <input type="text" id="dest-name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" placeholder="e.g., Maui" />
                    <label htmlFor="dest-loc" className="block text-sm font-medium text-gray-300 mt-4 mb-1">Location for Geocoding</label>
                    <input type="text" id="dest-loc" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" placeholder="e.g., Maui, Hawaii, USA" />
                </div>
            );
            case 1: return (
                <div>
                    <p className="text-sm text-gray-400 mb-4">Select a primary color for the team dashboard, or use AI to suggest colors based on the destination name.</p>
                     <button onClick={handleSuggestColors} disabled={isLoading} className="text-sm bg-gray-600 px-3 py-1 rounded-md mb-4 hover:bg-gray-500">✨ Suggest Colors</button>
                    <div className="flex flex-wrap gap-3">
                        {suggestedColors.map(colorName => {
                            const themeOption = availableThemes.find(t => t.value === colorName);
                            if (!themeOption) return null;
                            return <button key={themeOption.value} onClick={() => setColor(themeOption.value)} className={`w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-gray-800 ${color === themeOption.value ? 'ring-white' : 'ring-transparent'}`} style={{ backgroundColor: themeOption.hex }} />;
                        })}
                    </div>
                </div>
            );
            case 2: return <p className="text-center">A new set of questions will be configured for <strong>{newDestination.name}</strong> and added to the downloadable XLSX template.</p>;
            case 3: return <p className="text-center">10 new 'Monitor' user accounts will be automatically created for <strong>{newDestination.name}</strong>. You can edit them in the 'Users' tab later.</p>;
            case 4: return <p className="text-center">Finally, we'll use AI to generate a unique background image for your new destination's dashboard.</p>;
            default: return null;
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Destination">
            <div className="space-y-6">
                <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            <div className="flex items-center flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep >= index ? 'bg-teal-500 text-white' : 'bg-gray-600 text-gray-300'}`}>{index + 1}</div>
                                <span className={`ml-2 text-xs sm:text-sm ${activeStep >= index ? 'text-white' : 'text-gray-400'}`}>{step}</span>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-0.5 min-w-[16px] ${activeStep > index ? 'bg-teal-500' : 'bg-gray-600'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
                <div className="min-h-[150px] bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center justify-center">
                    {isLoading ? <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : renderStepContent()}
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex justify-between">
                    <button onClick={handleBack} disabled={activeStep === 0 || isLoading} className="px-4 py-2 text-sm bg-gray-600 rounded-md disabled:opacity-50">Back</button>
                    <div className="flex gap-2">
                        {activeStep === 4 && error && <button onClick={handleSkipImage} disabled={isLoading} className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-md">Skip & Finish</button>}
                        <button onClick={handleNext} disabled={isLoading} className="px-4 py-2 text-sm bg-teal-600 text-white rounded-md disabled:opacity-50 min-w-[120px]">
                           {isLoading ? 'Processing...' : activeStep === steps.length - 1 ? 'Finish & Generate' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};