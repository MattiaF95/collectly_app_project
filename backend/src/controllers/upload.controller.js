import { compressImage, createThumbnail, deleteImage } from '../utils/image.util.js';
import path from 'path';

export const uploadImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Nessuna immagine caricata' });
        }

        const imagePromises = req.files.map(async (file) => {
            // Comprimi immagine
            const compressedPath = await compressImage(file.path);

            // Crea thumbnail
            const thumbnailPath = await createThumbnail(compressedPath);

            return {
                original: `/uploads/images/${path.basename(compressedPath)}`,
                thumbnail: `/uploads/images/${path.basename(thumbnailPath)}`,
                size: file.size
            };
        });

        const images = await Promise.all(imagePromises);

        res.json({
            message: 'Immagini caricate con successo',
            images
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUploadedImage = async (req, res, next) => {
    try {
        const { imagePath } = req.body;

        if (!imagePath) {
            return res.status(400).json({ message: 'Path immagine non fornito' });
        }

        const fullPath = path.join(__dirname, '../../', imagePath);
        deleteImage(fullPath);

        res.json({ message: 'Immagine eliminata con successo' });
    } catch (error) {
        next(error);
    }
};
