import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Importa il modello User
import User from '../models/User.js';

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connesso a MongoDB');

        // Pulisci database
        await User.deleteMany({});
        console.log('🗑️  Database pulito');

        // Crea utente admin con USERNAME
        const admin = await User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'admin123'
        });
        console.log('👤 Admin creato:', admin.email, admin.username);

        // Crea utente normale con USERNAME
        const user = await User.create({
            username: 'mario_rossi',
            email: 'test@test.com',
            password: 'test123'
        });

        // Verifica che siano stati salvati
        const totalUsers = await User.countDocuments();
        console.log(`\n📊 Totale utenti nel database: ${totalUsers}`);

        // Mostra tutti gli utenti (senza password)
        const allUsers = await User.find({});
        console.log('\n👥 Utenti nel database:');
        allUsers.forEach(u => {
            console.log(`  - ${u.email} (${u.username})`);
        });

        console.log('\n✅ Seed completato!');
        console.log('📝 Credenziali:');
        console.log(`   Admin: ${admin.email} / admin123 (username: admin))`);
        console.log(`   User:  ${user.email} / test123 (username: mario_rossi)`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Errore:', error.message);
        process.exit(1);
    }
};

seedDatabase();
