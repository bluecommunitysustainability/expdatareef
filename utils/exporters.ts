import type { Question, Answers, AnswerObject } from '../types';
import * as XLSX from 'xlsx';

export const exportToJson = (answers: Answers, destination: string) => {
    const dataToExport = {
        destination,
        answers, // Export the full AnswerObject structure
        exportedAt: new Date().toISOString(),
    };
    const jsonString = JSON.stringify(dataToExport, (key, value) => {
        if (value instanceof File) {
            return { fileName: value.name, type: value.type, size: value.size };
        }
        return value;
    }, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Assessment_${destination.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
};


const getDisplayAnswer = (answerObj: AnswerObject | undefined) => {
    if (!answerObj || answerObj.value === null || answerObj.value === undefined) {
        return '';
    }
    if (answerObj.value instanceof File) {
        return answerObj.value.name;
    }
    return answerObj.value;
};


export const exportToCSV = (questions: Question[], answers: Answers, destination: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Section,Question,Answer,Source,AI-Generated\r\n";

    questions.forEach(q => {
        const questionText = q.text.replace(/{Destination}/g, destination).replace(/"/g, '""');
        const answerObj = answers[q.id];
        const displayAnswer = getDisplayAnswer(answerObj);
        const answerText = String(displayAnswer).replace(/"/g, '""');
        const sourceText = (answerObj?.source || '').replace(/"/g, '""');
        const aiGeneratedText = answerObj?.aiGenerated ? 'Yes' : 'No';

        const row = [q.id, q.section, `"${questionText}"`, `"${answerText}"`, `"${sourceText}"`, `"${aiGeneratedText}"`].join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Assessment_${destination.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToXLSX = (questions: Question[], answers: Answers, destination: string) => {
    const data = questions.map(q => {
        const answerObj = answers[q.id];
        const displayAnswer = getDisplayAnswer(answerObj);
        
        return {
            'ID': q.id,
            'Section': q.section,
            'Question': q.text.replace(/{Destination}/g, destination),
            'Answer': displayAnswer,
            'Source': answerObj?.source || '',
            'AI-Generated': answerObj?.aiGenerated ? 'Yes' : 'No'
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
        { wch: 50 }, // Answer
        { wch: 50 }, // Source
        { wch: 15 }  // AI-Generated
    ];
    worksheet['!cols'] = cols;

    XLSX.writeFile(workbook, `Sustainable_Tourism_Assessment_${destination.replace(/\s+/g, '_')}.xlsx`);
};

export const exportStakeholderToXLSX = (
    questions: Question[], 
    answers: Answers, 
    destination: string, 
    sectionTimestamps: Record<string, string>,
    metricGroup: string
) => {
    const getStatus = (answer: AnswerObject | undefined): string => {
        if (!answer || answer.value === null || answer.value === undefined || answer.value === '') return 'Incomplete';
        if (typeof answer.value === 'boolean') return answer.value ? 'Complete' : 'Action Needed';
        if (typeof answer.value === 'number' && answer.value > 0) return 'Complete';
        if (typeof answer.value === 'number' && answer.value === 0) return 'Action Needed';
        return 'In Progress';
    };

    const data = questions.map(q => {
        const answerObj = answers[q.id];
        return {
            'Metric ID': q.id,
            'Metric Group': q.section,
            'Metric': q.text.replace(/{Destination}/g, destination),
            'Finding': getDisplayAnswer(answerObj),
            'Status': getStatus(answerObj),
            'Trend': 'No Change', // Placeholder
            'Last Updated': sectionTimestamps[q.section] ? new Date(sectionTimestamps[q.section]).toLocaleDateString() : 'N/A',
            'Source': answerObj?.source || 'N/A',
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const sheetName = metricGroup === 'ALL' ? 'All Metrics' : metricGroup.substring(0, 30);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    worksheet['!cols'] = [
        { wch: 15 }, // ID
        { wch: 30 }, // Group
        { wch: 80 }, // Metric
        { wch: 50 }, // Finding
        { wch: 15 }, // Status
        { wch: 15 }, // Trend
        { wch: 20 }, // Last Updated
        { wch: 50 }, // Source
    ];

    const fileName = `Stakeholder_Report_${destination.replace(/\s+/g, '_')}_${metricGroup.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
};

// --- TEMPLATE GENERATORS ---

export const generateCsvTemplate = (questions: Question[], destination: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Question ID,Question Text,Answer\r\n";

    questions.forEach(q => {
        const questionText = q.text.replace(/{Destination}/g, destination).replace(/"/g, '""');
        const row = [q.id, `"${questionText}"`, ''].join(',');
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Template_${destination.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generateXlsxTemplate = (questions: Question[], allDestinations: string[]) => {
    const workbook = XLSX.utils.book_new();

    allDestinations.forEach(destination => {
        const data = questions.map(q => ({
            'Question ID': q.id,
            'Question Text': q.text.replace(/{Destination}/g, destination),
            'Answer': ''
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(data);
        const cols = [{ wch: 15 }, { wch: 100 }, { wch: 50 }];
        worksheet['!cols'] = cols;

        // Sheet names must be 31 chars or less
        const sheetName = destination.length > 31 ? destination.substring(0, 31) : destination;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, 'All_Destinations_Template.xlsx');
};
