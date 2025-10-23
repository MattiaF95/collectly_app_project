import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    try {
        // Estrai token
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Token non fornito' });
        }

        // Verifica token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Trova utente (opzionale, ma utile per avere i dati completi)
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        // Aggiungi a req per usarlo nei controller
        req.userId = user._id;
        req.user = user;

        next();
    } catch (error) {
        console.error('Errore autenticazione:', error);

        // Gestione errori specifici
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token non valido' });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token scaduto' });
        }

        res.status(401).json({ message: 'Autenticazione fallita' });
    }
};
