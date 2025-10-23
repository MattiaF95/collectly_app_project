import express from 'express';
import {
    getCollectibles,
    getCollectibleById,
    createCollectible,
    updateCollectible,
    deleteCollectible,
    getFavorites,
    searchCollectibles
} from '../controllers/collectible.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/favorites', getFavorites);
router.get('/search', searchCollectibles);
router.get('/collection/:collectionId', getCollectibles);
router.get('/collection/:collectionId/:id', getCollectibleById);
router.post('/collection/:collectionId', createCollectible);
router.put('/collection/:collectionId/:id', updateCollectible);
router.delete('/collection/:collectionId/:id', deleteCollectible);

export default router;
