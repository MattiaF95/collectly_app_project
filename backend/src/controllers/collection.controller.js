import Collection from '../models/Collection.js';
import Collectible from '../models/Collectible.js';

export const getCollections = async (req, res, next) => {
    try {
        const collections = await Collection.find({ userId: req.userId })
            .notDeleted()
            .sort({ createdAt: -1 });
        res.json(collections);
    } catch (error) {
        next(error);
    }
};

export const getCollectionById = async (req, res, next) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            userId: req.userId,
            deletedAt: null
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        res.json(collection);
    } catch (error) {
        next(error);
    }
};

export const createCollection = async (req, res, next) => {
    try {
        const collection = await Collection.create({
            ...req.body,
            userId: req.userId
        });

        res.status(201).json(collection);
    } catch (error) {
        next(error);
    }
};

export const updateCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId, deletedAt: null },
            req.body,
            { new: true, runValidators: true }
        );

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        res.json(collection);
    } catch (error) {
        next(error);
    }
};

export const deleteCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        // Soft delete
        await collection.softDelete();

        // Pianifica eliminazione definitiva dopo 24h
        setTimeout(async () => {
            const col = await Collection.findById(req.params.id);
            if (col && col.deletedAt) {
                await Collectible.deleteMany({ collectionId: col._id });
                await col.deleteOne();
            }
        }, 24 * 60 * 60 * 1000);

        res.json({ message: 'Collezione eliminata (ripristinabile per 24h)' });
    } catch (error) {
        next(error);
    }
};

export const restoreCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!collection || !collection.deletedAt) {
            return res.status(404).json({ message: 'Collezione non trovata o non eliminata' });
        }

        // Verifica che non siano passate più di 24h
        const hoursSinceDeletion = (Date.now() - collection.deletedAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceDeletion > 24) {
            return res.status(400).json({ message: 'Periodo di ripristino scaduto' });
        }

        await collection.restore();
        res.json(collection);
    } catch (error) {
        next(error);
    }
};
