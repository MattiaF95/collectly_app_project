import express from 'express';
import {
    getCollectibles,
    getCollectibleById,
    createCollectible,
    updateCollectible,
    deleteCollectible,
    toggleFavorite,
    getFavorites,
    searchCollectibles,
} from '../controllers/collectible.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tutte le routes richiedono autenticazione
router.use(authenticate);

// GET /api/collectibles/favorites - Lista favoriti
router.get('/favorites', getFavorites);

// GET /api/collectibles/search?q=query - Ricerca
router.get('/search', searchCollectibles);

// GET /api/collectibles/collection/:collectionId - Lista collectibles
router.get('/collection/:collectionId', getCollectibles);

// GET /api/collectibles/:id - Dettagli collectible
router.get('/:id', getCollectibleById);

// POST /api/collectibles/collection/:collectionId - Crea collectible
router.post('/collection/:collectionId', createCollectible);

// PUT /api/collectibles/:id - Aggiorna collectible
router.put('/:id', updateCollectible);

// DELETE /api/collectibles/:id - Elimina collectible
router.delete('/:id', deleteCollectible);

// PATCH /api/collectibles/:id/favorite - Toggle favorito
router.patch('/:id/favorite', toggleFavorite);

export default router;
