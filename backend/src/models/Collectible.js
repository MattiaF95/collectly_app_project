import mongoose from 'mongoose';

const baseSchema = {
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
        required: true
    },
    images: [{
        type: String
    }],
    estimatedValue: Number,
    purchasePrice: Number,
    addedDate: {
        type: Date,
        default: Date.now
    },
    personalNotes: String,
    isFavorite: {
        type: Boolean,
        default: false
    }
};

// Schema specifico per Film/Serie TV
const movieSchema = new mongoose.Schema({
    ...baseSchema,
    title: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        enum: ['movie', 'series'],
        required: true
    },
    releaseYear: Number,
    genres: [String],
    director: String,
    actors: [String],
    format: [String],
    audioLanguages: [String],
    subtitles: [String],
    duration: Number,
    seasons: Number,
    episodes: Number,
    barcode: String,
    specialEdition: [String],
    status: {
        type: String,
        enum: ['to_watch', 'watching', 'completed']
    }
}, {
    timestamps: true
});

// Indexes per ricerca e filtraggio
movieSchema.index({ userId: 1, collectionId: 1 });
movieSchema.index({ title: 'text', director: 'text', actors: 'text' });
movieSchema.index({ isFavorite: 1 });

export default mongoose.model('Collectible', movieSchema);
