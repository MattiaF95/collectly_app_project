import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
    {
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
        },
        name: {
            type: String,
            required: true,
        },
        subtitle: String,
        color: String,
        enabledFields: [String],
        itemCount: {
            type: Number,
            default: 0,
        },
        totalValue: {
            type: Number,
            default: 0,
        },
        totalCost: {
            type: Number,
            default: 0,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

collectionSchema.index({ userId: 1, deletedAt: 1 });

export default mongoose.model('Collection', collectionSchema);
