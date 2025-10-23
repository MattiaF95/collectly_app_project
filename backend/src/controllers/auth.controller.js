import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        // Verifica se l'utente esiste già
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già registrata' });
        }

        // Crea nuovo utente
        const user = await User.create({
            email,
            username,
            password
        });

        // Genera token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            message: 'Registrazione completata',
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Trova utente
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Verifica password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Genera token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        // Rimuove password dalla risposta
        user.password = undefined;

        res.json({
            message: 'Login effettuato',
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
};
