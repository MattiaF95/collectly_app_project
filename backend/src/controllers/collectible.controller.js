import Collectible from '../models/collectible.model.js';
import Collection from '../models/collection.model.js';

// @desc    Get collectibles per collezione
// @route   GET /api/collectibles/collection/:collectionId
// @access  Private
export const getCollectibles = async (req, res, next) => {
    try {
        const { collectionId } = req.params;

        // Verifica che la collezione appartenga all'utente
        const collection = await Collection.findOne({
            _id: collectionId,
            userId: req.userId,
            deletedAt: null,
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        // Recupera collectibles
        const collectibles = await Collectible.find({
            collectionId,
            userId: req.userId,
            deletedAt: null,
        }).sort({ createdAt: -1 });

        res.json(collectibles);
    } catch (error) {
        next(error);
    }
};

// @desc    Get singolo collectible
// @route   GET /api/collectibles/:id
// @access  Private
export const getCollectibleById = async (req, res, next) => {
    try {
        const collectible = await Collectible.findOne({
            _id: req.params.id,
            userId: req.userId,
            deletedAt: null,
        });

        if (!collectible) {
            return res.status(404).json({ message: 'Oggetto non trovato' });
        }

        res.json(collectible);
    } catch (error) {
        next(error);
    }
};

// @desc    Crea nuovo collectible
// @route   POST /api/collectibles/collection/:collectionId
// @access  Private
export const createCollectible = async (req, res, next) => {
    try {
        const { collectionId } = req.params;

        // Verifica che la collezione appartenga all'utente
        const collection = await Collection.findOne({
            _id: collectionId,
            userId: req.userId,
            deletedAt: null,
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        // Crea collectible
        const collectible = await Collectible.create({
            ...req.body,
            collectionId,
            userId: req.userId,
            type: collection.type,
        });

        // Aggiorna contatori collezione
        await updateCollectionStats(collectionId);

        res.status(201).json(collectible);
    } catch (error) {
        next(error);
    }
};

// @desc    Aggiorna collectible
// @route   PUT /api/collectibles/:id
// @access  Private
export const updateCollectible = async (req, res, next) => {
    try {
        const collectible = await Collectible.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId,
                deletedAt: null,
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!collectible) {
            return res.status(404).json({ message: 'Oggetto non trovato' });
        }

        // Aggiorna contatori collezione
        await updateCollectionStats(collectible.collectionId);

        res.json(collectible);
    } catch (error) {
        next(error);
    }
};

// @desc    Elimina collectible (soft delete)
// @route   DELETE /api/collectibles/:id
// @access  Private
export const deleteCollectible = async (req, res, next) => {
    try {
        const collectible = await Collectible.findOne({
            _id: req.params.id,
            userId: req.userId,
            deletedAt: null,
        });

        if (!collectible) {
            return res.status(404).json({ message: 'Oggetto non trovato' });
        }

        // Soft delete
        collectible.deletedAt = new Date();
        await collectible.save();

        // Aggiorna contatori collezione
        await updateCollectionStats(collectible.collectionId);

        res.json({ message: 'Oggetto eliminato' });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle favorito
// @route   PATCH /api/collectibles/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res, next) => {
    try {
        const collectible = await Collectible.findOne({
            _id: req.params.id,
            userId: req.userId,
            deletedAt: null,
        });

        if (!collectible) {
            return res.status(404).json({ message: 'Oggetto non trovato' });
        }

        collectible.isFavorite = !collectible.isFavorite;
        await collectible.save();

        res.json(collectible);
    } catch (error) {
        next(error);
    }
};

// @desc    Get tutti i favoriti dell'utente
// @route   GET /api/collectibles/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
    try {
        const favorites = await Collectible.find({
            userId: req.userId,
            isFavorite: true,
            deletedAt: null,
        }).sort({ createdAt: -1 });

        res.json(favorites);
    } catch (error) {
        next(error);
    }
};

// @desc    Cerca collectibles
// @route   GET /api/collectibles/search?q=query
// @access  Private
export const searchCollectibles = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json([]);
        }

        const results = await Collectible.find({
            userId: req.userId,
            deletedAt: null,
            $text: { $search: q },
        }).limit(50);

        res.json(results);
    } catch (error) {
        next(error);
    }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

async function updateCollectionStats(collectionId) {
    try {
        const collectibles = await Collectible.find({
            collectionId,
            deletedAt: null,
        });

        const stats = {
            itemCount: collectibles.length,
            totalCost: collectibles.reduce((sum, item) => sum + (item.purchasePrice || 0), 0),
            totalValue: collectibles.reduce((sum, item) => sum + (item.estimatedValue || 0), 0),
        };

        await Collection.findByIdAndUpdate(collectionId, stats);
    } catch (error) {
        console.error('Errore update collection stats:', error);
    }
}
