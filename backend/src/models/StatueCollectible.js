import mongoose from 'mongoose';

const statueCollectibleSchema = new mongoose.Schema({
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
        default: 'statue'
    },
    name: {
        type: String,
        required: true
    },
    character: String,
    series: String,
    manufacturer: String,
    category: String,
    limitedEdition: {
        number: Number,
        total: Number
    },
    barcode: String,
    dimensions: {
        scale: String,
        height: Number,
        width: Number,
        depth: Number
    },
    releaseYear: Date,
    estimatedValue: Number,
    purchasePrice: Number,
    materials: [String],
    condition: {
        type: String,
        enum: ['mint', 'near_mint', 'good', 'fair', 'poor']
    },
    packaging: {
        type: String,
        enum: ['with_original_box', 'without_original_box']
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    purchaseLocation: String,
    images: [String],
    personalNotes: String,
    status: {
        type: String,
        enum: ['new', 'used', 'damaged', 'missing_parts']
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

statueCollectibleSchema.index({ userId: 1, collectionId: 1 });
statueCollectibleSchema.index({ name: 'text', character: 'text', series: 'text' });

export default mongoose.model('StatueCollectible', statueCollectibleSchema);
