import mongoose from 'mongoose';

const collectibleSchema = new mongoose.Schema(
    {
        // ========================================
        // RIFERIMENTI (Obbligatori)
        // ========================================
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collection',
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['movies', 'comics', 'statues', 'stamps', 'books', 'magazines'],
            index: true,
        },

        // ========================================
        // CAMPI FILM/SERIE TV
        // ========================================
        title: String, // Usato anche per comics, books, magazines
        itemType: {
            type: String,
            enum: ['movie', 'series'],
        },
        releaseYear: Number,
        genres: [String], // Usato anche per comics, books
        director: String,
        actors: [String],
        format: [String], // Film: ['bluray', 'dvd', '4k']
        audioLanguages: [String],
        subtitles: [String],
        duration: Number, // minuti
        seasons: Number,
        episodes: Number,
        specialEdition: [String],
        status: {
            type: String,
            enum: ['to_watch', 'watching', 'completed'],
        },

        // ========================================
        // CAMPI FUMETTI
        // ========================================
        issueNumber: Number, // Usato anche per magazines
        series: String, // Usato anche per magazines
        publisher: String, // Usato anche per books, magazines
        publicationYear: Number, // Usato anche per books
        language: String, // Usato anche per books
        authors: [String], // Usato anche per books
        illustrators: [String],
        comicFormat: {
            type: String,
            enum: ['stapled', 'hardcover', 'paperback', 'omnibus', 'tankobon'],
        },
        pageCount: Number, // Usato anche per books, magazines
        coverImage: String, // Immagine principale copertina
        readingStatus: {
            type: String,
            enum: ['read', 'to_read', 'reading'],
        },

        // ========================================
        // CAMPI STATUE
        // ========================================
        name: String, // Usato anche per stamps
        character: String,
        manufacturer: String,
        scale: String, // es. "1/6", "1/4"
        height: Number, // cm
        material: String,
        weight: Number, // kg
        limitedEdition: Boolean,
        editionSize: Number, // Numero pezzi prodotti

        // ========================================
        // CAMPI FRANCOBOLLI
        // ========================================
        country: String,
        issueYear: Number,
        faceValue: Number, // Valore nominale
        catalogNumber: String,
        printRun: Number, // Tiratura
        perforation: String, // es. "14x13.5"
        watermark: String,
        stampCondition: {
            type: String,
            enum: ['mint', 'mint_never_hinged', 'lightly_hinged', 'hinged', 'used', 'damaged'],
        },

        // ========================================
        // CAMPI LIBRI
        // ========================================
        author: String,
        isbn: String,
        pages: Number,
        edition: String,
        bookFormat: {
            type: String,
            enum: ['hardcover', 'paperback', 'ebook', 'audiobook'],
        },
        publicationDate: Date,

        // ========================================
        // CAMPI PERIODICI/RIVISTE
        // ========================================
        coverDate: String, // Data in copertina
        magazineNumber: Number,

        // ========================================
        // CAMPI COMUNI A TUTTI
        // ========================================
        barcode: String,
        condition: {
            type: String,
            enum: ['mint', 'near_mint', 'good', 'fair', 'poor', 'damaged'],
        },
        purchasePrice: Number,
        estimatedValue: Number,
        images: [String], // Array di URL immagini
        personalNotes: String,
        isFavorite: {
            type: Boolean,
            default: false,
            index: true,
        },
        addedDate: {
            type: Date,
            default: Date.now,
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
    },
    {
        timestamps: true, // Aggiunge createdAt e updatedAt
    }
);

// ========================================
// INDEXES per Performance
// ========================================

// Index composti per query comuni
collectibleSchema.index({ userId: 1, collectionId: 1 });
collectibleSchema.index({ userId: 1, type: 1 });
collectibleSchema.index({ userId: 1, isFavorite: 1 });
collectibleSchema.index({ userId: 1, deletedAt: 1 });

// Full-text search su campi testuali
collectibleSchema.index({
    title: 'text',
    name: 'text',
    series: 'text',
    author: 'text',
    director: 'text',
    publisher: 'text',
    character: 'text',
});

// ========================================
// VIRTUAL FIELDS (Calcolati)
// ========================================

// Restituisce il nome principale dell'oggetto
collectibleSchema.virtual('displayName').get(function () {
    return this.title || this.name || 'Senza titolo';
});

// Valore netto (guadagno/perdita)
collectibleSchema.virtual('netValue').get(function () {
    if (this.estimatedValue && this.purchasePrice) {
        return this.estimatedValue - this.purchasePrice;
    }
    return 0;
});

// Percentuale di guadagno/perdita
collectibleSchema.virtual('valuePercentage').get(function () {
    if (this.estimatedValue && this.purchasePrice && this.purchasePrice > 0) {
        return ((this.estimatedValue - this.purchasePrice) / this.purchasePrice) * 100;
    }
    return 0;
});

// ========================================
// METODI ISTANZA
// ========================================

// Restituisce solo i campi compilati (non null/undefined/vuoti)
collectibleSchema.methods.getFilledFields = function () {
    const filled = {};
    const excludeFields = [
        '_id',
        '__v',
        'createdAt',
        'updatedAt',
        'userId',
        'collectionId',
        'type',
        'deletedAt',
        'addedDate',
    ];

    Object.keys(this.toObject()).forEach((key) => {
        if (excludeFields.includes(key)) return;

        const value = this[key];

        // Escludi valori nulli/vuoti
        if (value === null || value === undefined || value === '') return;

        // Escludi array vuoti
        if (Array.isArray(value) && value.length === 0) return;

        filled[key] = value;
    });

    return filled;
};

// Restituisce i campi formattati per visualizzazione
collectibleSchema.methods.getDisplayFields = function () {
    const fields = this.getFilledFields();
    const display = [];

    // Mappa campi -> etichette leggibili
    const labels = {
        title: 'Titolo',
        name: 'Nome',
        director: 'Regista',
        releaseYear: 'Anno',
        duration: 'Durata (min)',
        publisher: 'Editore',
        author: 'Autore',
        issueNumber: 'Numero',
        series: 'Serie',
        character: 'Personaggio',
        manufacturer: 'Produttore',
        scale: 'Scala',
        height: 'Altezza (cm)',
        condition: 'Condizione',
        purchasePrice: 'Prezzo Acquisto (€)',
        estimatedValue: 'Valore Stimato (€)',
        barcode: 'Barcode',
        personalNotes: 'Note',
    };

    Object.keys(fields).forEach((key) => {
        if (labels[key]) {
            display.push({
                label: labels[key],
                value: fields[key],
                key: key,
            });
        }
    });

    return display;
};

// ========================================
// METODI STATICI
// ========================================

// Trova collectibles con filtri avanzati
collectibleSchema.statics.findByFilters = function (userId, filters = {}) {
    const query = { userId, deletedAt: null };

    if (filters.collectionId) {
        query.collectionId = filters.collectionId;
    }

    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.isFavorite !== undefined) {
        query.isFavorite = filters.isFavorite;
    }

    if (filters.search) {
        query.$text = { $search: filters.search };
    }

    if (filters.minValue) {
        query.estimatedValue = { $gte: filters.minValue };
    }

    if (filters.maxValue) {
        query.estimatedValue = { ...query.estimatedValue, $lte: filters.maxValue };
    }

    return this.find(query).sort({ createdAt: -1 });
};

// Statistiche per utente
collectibleSchema.statics.getUserStats = async function (userId) {
    const stats = await this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId), deletedAt: null } },
        {
            $group: {
                _id: null,
                totalItems: { $sum: 1 },
                totalValue: { $sum: '$estimatedValue' },
                totalCost: { $sum: '$purchasePrice' },
                favoriteCount: {
                    $sum: { $cond: ['$isFavorite', 1, 0] },
                },
            },
        },
    ]);

    return stats[0] || { totalItems: 0, totalValue: 0, totalCost: 0, favoriteCount: 0 };
};

// ========================================
// MIDDLEWARE
// ========================================

// Pre-save: Normalizza dati
collectibleSchema.pre('save', function (next) {
    // Trim stringhe
    if (this.title) this.title = this.title.trim();
    if (this.name) this.name = this.name.trim();

    next();
});

// Abilita virtuals nei JSON
collectibleSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        // Rimuovi __v
        delete ret.__v;
        return ret;
    },
});

collectibleSchema.set('toObject', { virtuals: true });

// ========================================
// EXPORT
// ========================================

export default mongoose.model('Collectible', collectibleSchema);
