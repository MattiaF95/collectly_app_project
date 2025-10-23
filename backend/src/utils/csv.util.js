import csvParser from 'csv-parser';
import { createReadStream } from 'fs';

export const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
};

export const mapCSVToCollectible = (csvData, collectionType) => {
    // Mapping campi CSV ai campi del database
    const fieldMappings = {
        movies: {
            'Title': 'title',
            'Year': 'releaseYear',
            'Director': 'director',
            'Genre': 'genres',
            // ... altri mapping
        }
    };

    const mapping = fieldMappings[collectionType];

    return csvData.map(row => {
        const collectible = {};
        Object.entries(row).forEach(([csvField, value]) => {
            const dbField = mapping[csvField];
            if (dbField) {
                collectible[dbField] = value;
            }
        });
        return collectible;
    });
};
