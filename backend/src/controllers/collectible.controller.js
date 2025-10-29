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

        // ✅ LOG 1: Cosa arriva dal frontend
        console.log('\n========================================');
        console.log('📦 CREATE COLLECTIBLE');
        console.log('========================================');
        console.log('Collection ID:', collectionId);
        console.log('User ID:', req.userId);
        console.log('Body ricevuto:', JSON.stringify(req.body, null, 2));

        // Verifica che la collezione appartenga all'utente
        const collection = await Collection.findOne({
            _id: collectionId,
            userId: req.userId,
            deletedAt: null,
        });

        if (!collection) {
            console.error('❌ Collezione non trovata');
            return res.status(404).json({ message: 'Collezione non trovata' });
        }

        console.log('✅ Collezione trovata:', collection.name, '(Tipo:', collection.type + ')');

        // Prepara dati collectible
        const collectibleData = {
            ...req.body,
            collectionId,
            userId: req.userId,
            type: collection.type,
        };

        console.log('📦 Dati da salvare nel DB:', JSON.stringify(collectibleData, null, 2));

        // Crea collectible
        console.log('⏳ Creo collectible...');
        const collectible = await Collectible.create(collectibleData);
        console.log('✅ Collectible creato! ID:', collectible._id);

        // Aggiorna contatori collezione (con try-catch separato)
        try {
            console.log('📊 Aggiorno statistiche collezione...');
            await updateCollectionStats(collectionId);
            console.log('✅ Statistiche aggiornate');
        } catch (statsError) {
            console.error('⚠️ Errore aggiornamento stats (non bloccante):', statsError.message);
        }

        console.log('✅ Risposta inviata al frontend');
        console.log('========================================\n');

        res.status(201).json(collectible);
    } catch (error) {
        console.error('\n========================================');
        console.error('❌ ERRORE CREAZIONE COLLECTIBLE');
        console.error('========================================');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);

        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        console.error('========================================\n');

        // Invia errore dettagliato al frontend (solo in development)
        res.status(500).json({
            message: error.message || 'Errore durante la creazione',
            error: process.env.NODE_ENV === 'development' ? error.toString() : 'Internal Server Error'
        });
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
        console.log('📊 updateCollectionStats - Collection ID:', collectionId);

        const collectibles = await Collectible.find({
            collectionId,
            deletedAt: null,
        });

        console.log('📊 Trovati', collectibles.length, 'collectibles');

        const stats = {
            itemCount: collectibles.length,
            totalCost: collectibles.reduce((sum, item) => {
                const price = Number(item.purchasePrice) || 0;
                return sum + price;
            }, 0),
            totalValue: collectibles.reduce((sum, item) => {
                const value = Number(item.estimatedValue) || 0;
                return sum + value;
            }, 0),
        };

        console.log('📊 Stats calcolati:', stats);

        const updated = await Collection.findByIdAndUpdate(
            collectionId,
            stats,
            { new: true }
        );

        if (!updated) {
            console.error('⚠️ Collection non trovata per update stats:', collectionId);
        } else {
            console.log('✅ Stats salvati nella collection');
        }

    } catch (error) {
        console.error('❌ Errore updateCollectionStats:', error.message);
        console.error('Stack:', error.stack);
        throw error; // ✅ Propaga l'errore invece di nasconderlo
    }
}
