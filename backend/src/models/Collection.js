import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['movies', 'statues', 'stamps', 'comics', 'books', 'magazines']
    },
    name: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    color: {
        type: String,
        default: '#3498db'
    },
    enabledFields: [{
        type: String
    }],
    itemCount: {
        type: Number,
        default: 0
    },
    totalValue: {
        type: Number,
        default: 0
    },
    totalCost: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index per ricerche efficienti
collectionSchema.index({ userId: 1, type: 1 });
collectionSchema.index({ deletedAt: 1 });

// Soft delete: marca come eliminata ma mantiene per 24h
collectionSchema.methods.softDelete = function () {
    this.deletedAt = new Date();
    return this.save();
};

// Ripristina collezione eliminata
collectionSchema.methods.restore = function () {
    this.deletedAt = null;
    return this.save();
};

// Query helper per escludere collezioni eliminate
collectionSchema.query.notDeleted = function () {
    return this.where({ deletedAt: null });
};

export default mongoose.model('Collection', collectionSchema);
