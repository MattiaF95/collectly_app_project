import mongoose from 'mongoose';

const magazineCollectibleSchema = new mongoose.Schema({
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
        default: 'magazine'
    },
    title: {
        type: String,
        required: true
    },
    issueNumber: Number,
    series: String,
    publisher: String,
    publicationDate: Date,
    language: String,
    theme: String,
    pageCount: Number,
    condition: String,
    estimatedValue: Number,
    purchasePrice: Number,
    barcode: String,
    images: [String],
    addedDate: {
        type: Date,
        default: Date.now
    },
    personalNotes: String,
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

magazineCollectibleSchema.index({ userId: 1, collectionId: 1 });
magazineCollectibleSchema.index({ title: 'text', series: 'text' });

export default mongoose.model('MagazineCollectible', magazineCollectibleSchema);
