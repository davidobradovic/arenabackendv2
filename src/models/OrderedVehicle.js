const mongoose = require('mongoose');

const orderDocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
}, { _id: true });

const orderedVehicleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    vin: {
        type: String,
        required: true,
        unique: true
    },
    mileage: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    estimatedValue: {
        type: Number,
        required: true
    },
    actualValue: {
        type: Number,
        required: true
    }
}, { _id: false });

const orderedVehicleOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    orderedAt: {
        type: Date,
        default: Date.now
    },
    orderedVehicle: {
        type: orderedVehicleSchema,
        required: true
    },
    orderDocuments: [orderDocumentSchema],
    status: {
        type: String,
        enum: ['ordered', 'in_transit', 'delivered', 'cancelled'],
        default: 'ordered'
    },
    expectedArrival: {
        type: Date
    },
    receiptId: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        default: ''
    },
    orderImages: [{
        type: String
    }]
}, {
    timestamps: true
});

// Generate order number automatically
orderedVehicleOrderSchema.pre('save', async function (next) {
    if (this.isNew && !this.orderNumber) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 1-12

        // Find last order for this month
        const startOfMonth = new Date(year, now.getMonth(), 1);
        const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

        const lastOrder = await this.constructor
            .findOne({
                orderedAt: { $gte: startOfMonth, $lte: endOfMonth }
            })
            .sort({ createdAt: -1 }) // safest
            .lean();

        let orderCount = 1;
        if (lastOrder && lastOrder.orderNumber) {
            const lastNumber = parseInt(lastOrder.orderNumber.slice(-2)); // last two digits
            orderCount = lastNumber + 1;
        }

        // Format: ORD-YEAR-MMMNN (MM = month, NN = order count padded to 2)
        const monthStr = month.toString().padStart(2, '0');
        const countStr = orderCount.toString().padStart(2, '0');
        this.orderNumber = `ORD-${year}-${monthStr}${countStr}`;
    }
    next();
});


const OrderedVehicle = mongoose.model('OrderedVehicle', orderedVehicleOrderSchema);

module.exports = OrderedVehicle;