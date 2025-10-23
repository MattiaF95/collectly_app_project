import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import collectibleRoutes from './routes/collectible.routes.js';


dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/collectibles', collectibleRoutes);


// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Errore interno del server'
    });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connesso a MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server in ascolto su porta ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Errore connessione MongoDB:', err);
        process.exit(1);
    });

// Serve static files per le immagini
app.use('/uploads', express.static('uploads'));

