import mongoose from 'mongoose';

const bookCollectibleSchema = new mongoose.Schema({
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
        default: 'book'
    },
    title: {
        type: String,
        required: true
    },
    author: String,
    publisher: String,
    publicationYear: Number,
    isbn: String,
    language: String,
    genres: [String],
    pageCount: Number,
    format: {
        type: String,
        enum: ['hardcover', 'paperback', 'ebook', 'audiobook']
    },
    edition: String,
    condition: String,
    estimatedValue: Number,
    purchasePrice: Number,
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

bookCollectibleSchema.index({ userId: 1, collectionId: 1 });
bookCollectibleSchema.index({ title: 'text', author: 'text' });

export default mongoose.model('BookCollectible', bookCollectibleSchema);
