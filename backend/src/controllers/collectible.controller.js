import Collectible from '../models/Collectible.js';
import StatueCollectible from '../models/StatueCollectible.js';
import StampCollectible from '../models/StampCollectible.js';
import ComicCollectible from '../models/ComicCollectible.js';
import BookCollectible from '../models/BookCollectible.js';
import MagazineCollectible from '../models/MagazineCollectible.js';
import Collection from '../models/Collection.js';

// Mappa dei modelli per tipo
const collectibleModels = {
    movies: Collectible,
    statues: StatueCollectible,
    stamps: StampCollectible,
    comics: ComicCollectible,
    books: BookCollectible,
    magazines: MagazineCollectible
};

const getModelByType = (type) => {
    return collectibleModels[type] || Collectible;
};

export const getCollectibles = async (req, res, next) => {
    try {
        const { collectionId } = req.params;

        const collection = await Collection.findOne({
            _id: collectionId,
            userId: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        const Model = getModelByType(collection.type);
        const collectibles = await Model.find({
            collectionId,
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json(collectibles);
    } catch (error) {
        next(error);
    }
};

export const getCollectibleById = async (req, res, next) => {
    try {
        const { collectionId, id } = req.params;

        const collection = await Collection.findOne({
            _id: collectionId,
            userId: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        const Model = getModelByType(collection.type);
        const collectible = await Model.findOne({
            _id: id,
            collectionId,
            userId: req.userId
        });

        if (!collectible) {
            return res.status(404).json({ message: 'Collectible non trovato' });
        }

        res.json(collectible);
    } catch (error) {
        next(error);
    }
};

export const createCollectible = async (req, res, next) => {
    try {
        const { collectionId } = req.params;

        const collection = await Collection.findOne({
            _id: collectionId,
            userId: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        const Model = getModelByType(collection.type);
        const collectible = await Model.create({
            ...req.body,
            collectionId,
            userId: req.userId,
            type: collection.type
        });

        // Aggiorna contatori collezione
        collection.itemCount = (collection.itemCount || 0) + 1;
        if (req.body.purchasePrice) {
            collection.totalCost = (collection.totalCost || 0) + req.body.purchasePrice;
        }
        if (req.body.estimatedValue) {
            collection.totalValue = (collection.totalValue || 0) + req.body.estimatedValue;
        }
        await collection.save();

        res.status(201).json(collectible);
    } catch (error) {
        next(error);
    }
};

export const updateCollectible = async (req, res, next) => {
    try {
        const { collectionId, id } = req.params;

        const collection = await Collection.findOne({
            _id: collectionId,
            userId: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        const Model = getModelByType(collection.type);
        const oldCollectible = await Model.findOne({
            _id: id,
            collectionId,
            userId: req.userId
        });

        if (!oldCollectible) {
            return res.status(404).json({ message: 'Collectible non trovato' });
        }

        // Aggiorna collectible
        const collectible = await Model.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        // Ricalcola totali collezione
        const allCollectibles = await Model.find({ collectionId, userId: req.userId });
        collection.totalCost = allCollectibles.reduce((sum, c) => sum + (c.purchasePrice || 0), 0);
        collection.totalValue = allCollectibles.reduce((sum, c) => sum + (c.estimatedValue || 0), 0);
        await collection.save();

        res.json(collectible);
    } catch (error) {
        next(error);
    }
};

export const deleteCollectible = async (req, res, next) => {
    try {
        const { collectionId, id } = req.params;

        const collection = await Collection.findOne({
            _id: collectionId,
            userId: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        const Model = getModelByType(collection.type);
        const collectible = await Model.findOneAndDelete({
            _id: id,
            collectionId,
            userId: req.userId
        });

        if (!collectible) {
            return res.status(404).json({ message: 'Collectible non trovato' });
        }

        // Aggiorna contatori
        collection.itemCount = Math.max(0, (collection.itemCount || 1) - 1);
        if (collectible.purchasePrice) {
            collection.totalCost = Math.max(0, (collection.totalCost || 0) - collectible.purchasePrice);
        }
        if (collectible.estimatedValue) {
            collection.totalValue = Math.max(0, (collection.totalValue || 0) - collectible.estimatedValue);
        }
        await collection.save();

        res.json({ message: 'Collectible eliminato' });
    } catch (error) {
        next(error);
    }
};

export const getFavorites = async (req, res, next) => {
    try {
        // Ottieni tutti i tipi di collezioni dell'utente
        const collections = await Collection.find({ userId: req.userId });
        const favorites = [];

        for (const collection of collections) {
            const Model = getModelByType(collection.type);
            const items = await Model.find({
                userId: req.userId,
                collectionId: collection._id,
                isFavorite: true
            });
            favorites.push(...items);
        }

        res.json(favorites);
    } catch (error) {
        next(error);
    }
};

export const searchCollectibles = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.json([]);
        }

        const collections = await Collection.find({ userId: req.userId });
        const results = [];

        for (const collection of collections) {
            const Model = getModelByType(collection.type);
            const items = await Model.find({
                userId: req.userId,
                collectionId: collection._id,
                $text: { $search: query }
            }).limit(20);

            results.push(...items);
        }

        res.json(results);
    } catch (error) {
        next(error);
    }
};
