import type { Answers, Question } from '../types';
import { destinationProfiles } from '../constants/destinationProfiles';

/**
 * Generates a comprehensive context string from all answered questions in the questionnaire.
 * This context is used to create more informed prompts for the AI.
 * @param questions The complete list of all questions in the questionnaire.
 * @param answers The current answers object.
 * @param destination The name of the destination being assessed.
 * @returns A formatted string containing all answered question-answer pairs.
 */
export const generateFullAnswerContext = (
    questions: Question[],
    answers: Answers,
    destination: string
): string => {
    // Start with the new destination profile context
    const profile = destinationProfiles[destination];
    let contextHeader = `--- Destination Context for ${destination} ---\n`;
    if (profile) {
        // Refined wording to be more descriptive for the AI model.
        contextHeader += `The destination is characterized as: ${profile.profile.join(', ')}.\n`;
        contextHeader += `Its primary tourism activities are centered around: ${profile.focus.join(', ')}.\n\n`;
    } else {
        contextHeader += `No specific profile information is available for this destination.\n\n`;
    }

    const answeredQuestions = questions.filter(q => {
        const answerObj = answers[q.id];
        return answerObj && answerObj.value !== null && answerObj.value !== undefined && answerObj.value !== '';
    });

    if (answeredQuestions.length === 0) {
        return contextHeader + "--- Previously Answered Questions ---\nNo answers have been provided yet for context.";
    }

    const qaContext = answeredQuestions.map(q => {
        const answerObj = answers[q.id];
        const stringValue = answerObj.value instanceof File ? `[File: ${answerObj.value.name}]` : String(answerObj.value);
        let context = `Section: ${q.section}\nID: ${q.id}\nQ: ${q.text.replace('{Destination}', destination)}\nA: ${stringValue}`;
        if (answerObj.source) {
            context += `\nSource: ${answerObj.source}`;
        }
        return context;
    }).join('\n\n---\n\n');

    return contextHeader + "--- Previously Answered Questions ---\n" + qaContext;
};
