import mongoose from 'mongoose';

const collectibleSchema = new mongoose.Schema({
    // Campi comuni
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['movies', 'comics', 'statues', 'stamps', 'books', 'magazines'],
        index: true
    },

    // FILM/SERIE TV
    title: String,
    itemType: {
        type: String,
        enum: ['movie', 'series']
    },
    releaseYear: Number,
    genres: [String],
    director: String,
    actors: [String],
    format: [String],
    audioLanguages: [{
        lang: String,
        codec: String,
        format: String
    }],
    subtitles: [String],
    duration: Number,
    seasons: Number,
    episodes: Number,
    barcode: String,
    specialEdition: [String],
    coverImage: [String],
    status: {
        type: String,
        enum: ['to_watch', 'watching', 'completed', 'read', 'to_read', 'reading', 'abandoned', 'new', 'used', 'damaged', 'missing_parts']
    },

    // STATUE
    name: String,
    character: String,
    series: String,
    manufacturer: String,
    category: String,
    limitedEdition: Boolean,
    editionNumber: Number,
    editionTotal: Number,
    scale: String,
    height: Number,
    width: Number,
    depth: Number,
    materials: [String],
    packaging: {
        type: String,
        enum: ['with_box', 'without_box']
    },
    purchaseLocation: String,

    // FRANCOBOLLI
    country: String,
    issueYear: Number,
    faceValue: Number,
    currency: String,
    catalogNumber: String,
    colors: [String],
    theme: String,
    stampCondition: {
        type: String,
        enum: ['new', 'used', 'no_gum']
    },
    perforation: String,
    printType: String,
    paper: String,
    watermark: String,
    gum: [String],
    cancellation: String,
    varieties: [String],
    certificate: String,
    provenance: String,

    // FUMETTI
    issueNumber: Number,
    publisher: String,
    publicationYear: Number,
    language: String,
    authors: [String],
    comicFormat: String,
    condition: {
        type: String,
        enum: ['mint', 'near_mint', 'good', 'fair', 'poor', 'new', 'like_new', 'worn', 'new_sealed', 'new_opened', 'damaged']
    },

    // LIBRI
    edition: String,
    bookFormat: String,
    autographed: Boolean,
    readingStatus: String,

    // PERIODICI
    totalIssues: Number,
    seriesStatus: {
        type: String,
        enum: ['ongoing', 'complete', 'abandoned', 'waiting']
    },

    // Campi comuni finanziari
    purchasePrice: Number,
    estimatedValue: Number,

    // Campi comuni metadata
    images: [String],
    personalNotes: String,
    isFavorite: {
        type: Boolean,
        default: false
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes
collectibleSchema.index({ collectionId: 1, userId: 1 });
collectibleSchema.index({ userId: 1, isFavorite: 1 });
collectibleSchema.index({ type: 1 });

export default mongoose.model('Collectible', collectibleSchema);
