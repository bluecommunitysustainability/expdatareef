/**
 * A robust CSV parser that correctly handles RFC 4180 standard formatting.
 * @param csvText The raw CSV string.
 * @returns An object containing the headers and the data rows.
 */
export const parseCsv = (csvText: string): { headers: string[], rows: string[][] } => {
    // Handle potential Byte Order Mark (BOM) at the start of the file
    if (csvText.charCodeAt(0) === 0xFEFF) {
        csvText = csvText.substring(1);
    }
    
    const lines = csvText.trim().replace(/\r\n/g, '\n').split('\n');
    if (lines.length === 0) return { headers: [], rows: [] };

    // This regex is designed to handle the complexities of CSV format (RFC 4180).
    const regex = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;

    const parseLine = (line: string): string[] => {
        const allMatches = Array.from(line.matchAll(regex));
        
        const values = allMatches.map(match => {
            // Group 1 (match[1]) contains the content of a quoted field.
            if (match[1] !== undefined) {
                // Un-escape double quotes ("") back to a single quote (").
                return match[1].replace(/""/g, '"');
            }
            // Group 2 (match[2]) contains the content of an unquoted field.
            if (match[2] !== undefined) {
                return match[2];
            }
            return '';
        });

        // The regex can produce an extra empty match if the line doesn't end with a comma.
        if (values.length > 0 && values[values.length - 1] === '' && !line.endsWith(',')) {
            return values.slice(0, -1);
        }
        
        return values;
    };

    const headers = parseLine(lines[0]).map(h => h.trim());
    const rows = lines.slice(1)
        .filter(line => line.trim() !== '') // Skip empty lines
        .map(line => {
            const parsedRow = parseLine(line).map(cell => cell.trim());
            // Pad row if it has fewer columns than headers
            while (parsedRow.length < headers.length) {
                parsedRow.push('');
            }
            return parsedRow;
        });
    
    return { headers, rows };
}