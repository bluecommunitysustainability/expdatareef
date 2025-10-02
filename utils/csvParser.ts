/**
 * A robust CSV parser that correctly handles RFC 4180 standard formatting,
 * including fields with commas, double quotes, and multi-line content.
 * @param csvText The raw CSV string.
 * @returns An object containing the headers and the data rows.
 */
export const parseCsv = (csvText: string): { headers: string[], rows: string[][] } => {
    // Handle potential Byte Order Mark (BOM) at the start of the file
    if (csvText.charCodeAt(0) === 0xFEFF) {
        csvText = csvText.substring(1);
    }
    
    const allRows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;

    // Normalize line endings
    csvText = csvText.trim().replace(/\r\n/g, '\n');

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];

        if (inQuotes) {
            if (char === '"') {
                if (csvText[i + 1] === '"') {
                    // Escaped double quote
                    currentField += '"';
                    i++; // Skip the next quote
                } else {
                    // End of quoted field
                    inQuotes = false;
                }
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                // Start of a quoted field, and clear the current field if it's empty
                if (currentField === '') {
                    inQuotes = true;
                } else {
                    currentField += char;
                }
            } else if (char === ',') {
                // End of a field
                currentRow.push(currentField);
                currentField = '';
            } else if (char === '\n') {
                // End of a row
                currentRow.push(currentField);
                allRows.push(currentRow);
                currentRow = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    
    // Add the last field and row if the file doesn't end with a newline
    if (currentField || currentRow.length > 0) {
         currentRow.push(currentField);
         allRows.push(currentRow);
    }

    if (allRows.length < 2) {
        return { headers: [], rows: [] };
    }

    const headers = allRows[0].map(h => h.trim());
    const dataRows = allRows.slice(1).filter(row => row.length > 0 && row.some(cell => cell.trim() !== ''));

    return { headers, rows: dataRows };
}