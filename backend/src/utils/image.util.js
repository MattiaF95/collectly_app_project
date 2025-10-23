import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const compressImage = async (filePath, quality = 80) => {
    try {
        const outputPath = filePath.replace(path.extname(filePath), '-compressed.jpg');

        await sharp(filePath)
            .resize(1920, 1920, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality, progressive: true })
            .toFile(outputPath);

        // Elimina file originale
        fs.unlinkSync(filePath);

        return outputPath;
    } catch (error) {
        console.error('Errore compressione immagine:', error);
        throw error;
    }
};

export const createThumbnail = async (filePath, size = 300) => {
    try {
        const thumbPath = filePath.replace(path.extname(filePath), '-thumb.jpg');

        await sharp(filePath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 70 })
            .toFile(thumbPath);

        return thumbPath;
    } catch (error) {
        console.error('Errore creazione thumbnail:', error);
        throw error;
    }
};

export const deleteImage = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Elimina anche thumbnail se esiste
        const thumbPath = filePath.replace(path.extname(filePath), '-thumb.jpg');
        if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
        }
    } catch (error) {
        console.error('Errore eliminazione immagine:', error);
    }
};
