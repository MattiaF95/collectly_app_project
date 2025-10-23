import mongoose from 'mongoose';

const stampCollectibleSchema = new mongoose.Schema({
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
        default: 'stamp'
    },
    name: {
        type: String,
        required: true
    },
    country: String,
    issueYear: Number,
    faceValue: Number,
    currency: String,
    series: String,
    catalogNumber: String,
    colors: [String],
    theme: [String],
    condition: {
        type: String,
        enum: ['mint', 'used', 'no_gum']
    },
    perforation: String,
    format: String,
    printType: String,
    paper: String,
    watermark: String,
    gum: [String],
    cancellation: String,
    specialConditions: [String],
    certificate: {
        authority: String,
        date: Date
    },
    estimatedValue: Number,
    purchasePrice: Number,
    provenance: String,
    images: [String],
    personalNotes: String,
    addedDate: {
        type: Date,
        default: Date.now
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

stampCollectibleSchema.index({ userId: 1, collectionId: 1 });
stampCollectibleSchema.index({ name: 'text', country: 'text', series: 'text' });

export default mongoose.model('StampCollectible', stampCollectibleSchema);
