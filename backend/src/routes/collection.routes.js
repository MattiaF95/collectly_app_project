import express from 'express';
import {
    getCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    restoreCollection
} from '../controllers/collection.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCollections);
router.get('/:id', getCollectionById);
router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);
router.post('/:id/restore', restoreCollection);

export default router;
