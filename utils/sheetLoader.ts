import { questions } from '../constants/questions';
import type { Answers, Question } from '../types';
import { QuestionType } from '../types';
import { autofillData } from '../data/autofillData';
import { getHawaiiAnswers } from '../data/hawaiiAutofillData';

/**
 * Parses the multi-line autofill data string into a structured map.
 * @returns A map where the key is the destination name and the value is another map of full question text to its answer.
 */
const parseAutofillData = (): Map<string, Map<string, string>> => {
    const allAnswers = new Map<string, Map<string, string>>();
    const lines = autofillData.split('\n').filter(line => line.trim() !== '');
    const lineRegex = /^Destination: (.*?), Question: (.*?), Answer: (.*)$/;

    for (const line of lines) {
        const match = line.match(lineRegex);
        if (match) {
            const [, destination, questionText, answer] = match;
            const dest = destination.trim();
            const ans = answer.trim();

            if (!allAnswers.has(dest)) {
                allAnswers.set(dest, new Map<string, string>());
            }
            
            allAnswers.get(dest)!.set(questionText.trim(), ans);
        }
    }
    return allAnswers;
};

// Memoize the parsed data to avoid reprocessing on every call.
let parsedData: Map<string, Map<string, string>> | null = null;
const getParsedData = (): Map<string, Map<string, string>> => {
    if (!parsedData) {
        parsedData = parseAutofillData();
    }
    return parsedData;
}

/**
 * Retrieves and processes answers for a given destination from the local autofill data source.
 * It now reliably matches questions by their number and converts answer values to their appropriate types.
 * @param destination The name of the destination to get answers for.
 * @returns A promise that resolves to an Answers object.
 */
export const checkSheetForAnswers = async (destination: string): Promise<Answers> => {
    if (destination === 'Hawaii') {
        return getHawaiiAnswers();
    }

    const allData = getParsedData();
    const destinationAnswers = allData.get(destination);

    if (!destinationAnswers) {
        console.warn(`No autofill data found for destination: ${destination}`);
        return {};
    }
    
    const newAnswers: Answers = {};

    destinationAnswers.forEach((answer, questionText) => {
        const questionNumberMatch = questionText.match(/\/(\d+)\./);
        if (!questionNumberMatch) return;

        const questionNumber = questionNumberMatch[1];
        
        // Find the first question that starts with `q` followed by the number.
        const matchedQuestion = questions.find(q => q.id.startsWith(`q${questionNumber}`));

        if (matchedQuestion) {
            // Do not fill if the answer is just a repeat of the question text.
            const questionTextForComparison = matchedQuestion.text.replace('{Destination}', destination);
            if (answer.trim().startsWith(questionTextForComparison.substring(0, 20))) {
                return;
            }

            let convertedValue: any = answer;
            switch(matchedQuestion.type) {
                case QuestionType.NUMBER:
                    const num = parseFloat(answer.replace(/,/g, ''));
                    convertedValue = isNaN(num) ? null : num;
                    break;
                case QuestionType.BOOLEAN:
                    const upperVal = answer.trim().toUpperCase();
                    if (upperVal === 'TRUE' || upperVal === 'YES') {
                        convertedValue = true;
                    } else if (upperVal === 'FALSE' || upperVal === 'NO') {
                        convertedValue = false;
                    } else {
                        convertedValue = null; 
                    }
                    break;
                default:
                    // Only use non-empty answers, and exclude placeholder links
                    convertedValue = (answer && answer !== '🔗') ? answer : null;
                    break;
            }

            if (convertedValue !== null) {
                newAnswers[matchedQuestion.id] = {
                    value: convertedValue,
                    source: 'Autofill Data Source',
                    aiGenerated: false
                };
            }
        }
    });

    return newAnswers;
};