import mongoose from 'mongoose';

const comicCollectibleSchema = new mongoose.Schema({
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
        default: 'comic'
    },
    title: {
        type: String,
        required: true
    },
    issueNumber: Number,
    series: String,
    publisher: String,
    publicationYear: Number,
    language: String,
    authors: [String],
    genres: [String],
    condition: String,
    estimatedValue: Number,
    purchasePrice: Number,
    barcode: String,
    format: {
        type: String,
        enum: ['stapled', 'hardcover', 'paperback', 'omnibus', 'tankobon']
    },
    pageCount: Number,
    coverImage: String,
    images: [String],
    addedDate: {
        type: Date,
        default: Date.now
    },
    personalNotes: String,
    readingStatus: {
        type: String,
        enum: ['read', 'to_read', 'reading']
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

comicCollectibleSchema.index({ userId: 1, collectionId: 1 });
comicCollectibleSchema.index({ title: 'text', series: 'text', authors: 'text' });

export default mongoose.model('ComicCollectible', comicCollectibleSchema);
