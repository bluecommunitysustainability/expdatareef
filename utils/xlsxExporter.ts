import * as XLSX from 'xlsx';
import type { Question, Answers } from '../types';

export const exportToXLSX = (questions: Question[], answers: Answers, destination: string) => {
    const data = questions.map(q => {
        const answerObj = answers[q.id];
        const answerValue = answerObj?.value;
        let displayAnswer: string | number | boolean | null;

        // FIX: The answer object's 'value' property holds the actual data.
        // Also, check if the value is a File instance.
        if (answerValue instanceof File) {
            displayAnswer = answerValue.name;
        } else if (answerValue === null || answerValue === undefined) {
            displayAnswer = null;
        } else {
            displayAnswer = answerValue;
        }

        return {
            'ID': q.id,
            'Section': q.section,
            'Question': q.text.replace(/{Destination}/g, destination),
            'Answer': displayAnswer
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessment');

    // Auto-fit columns
    const cols = [
        { wch: 10 }, // ID
        { wch: 30 }, // Section
        { wch: 80 }, // Question
        { wch: 50 }  // Answer
    ];
    worksheet['!cols'] = cols;

    XLSX.writeFile(workbook, `Sustainable_Tourism_Assessment_${destination.replace(/\s+/g, '_')}.xlsx`);
};