import {parse} from 'csv-parse/browser/esm/sync';

export const getContentFromCSV = async (file: File): Promise<any[]> => {

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await parse(buffer, {
        skip_empty_lines: true,
        delimiter: ';',
        quote: '"',
        escape: '"',
        trim: true,
        columns: true,
        cast: true
    });

    return data;
}