import Collection from '../models/collection.model.js';
import Collectible from '../models/collectible.model.js';

export const getCollections = async (req, res, next) => {
    try {
        const collections = await Collection.find({
            userId: req.userId,
            deletedAt: null,
        }).sort({ createdAt: -1 });

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
            deletedAt: null,
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
            userId: req.userId,
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
            userId: req.userId,
            deletedAt: null,
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        // Soft delete collezione
        collection.deletedAt = new Date();
        await collection.save();

        // Soft delete tutti i collectibles della collezione
        await Collectible.updateMany(
            { collectionId: collection._id },
            { deletedAt: new Date() }
        );

        res.json({ message: 'Collezione eliminata' });
    } catch (error) {
        next(error);
    }
};

export const restoreCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!collection || !collection.deletedAt) {
            return res.status(404).json({ message: 'Collezione non trovata o non eliminata' });
        }

        // Verifica che non siano passate più di 24h
        const hoursSinceDeletion = (Date.now() - collection.deletedAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceDeletion > 24) {
            return res.status(400).json({ message: 'Periodo di ripristino scaduto (24h)' });
        }

        // Ripristina collezione
        collection.deletedAt = null;
        await collection.save();

        // Ripristina collectibles
        await Collectible.updateMany(
            { collectionId: collection._id },
            { deletedAt: null }
        );

        res.json(collection);
    } catch (error) {
        next(error);
    }
};
