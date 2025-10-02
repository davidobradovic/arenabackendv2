const express = require('express');
const router = express.Router();
const OrderedVehicle = require('../models/OrderedVehicle');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dxo3z5off',
    api_key: '928131617372864',
    api_secret: '_IsnFVhqA43Bcpy2SKl7x8t60Bk'
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// GET all ordered vehicles
router.get('/', async (req, res) => {
    try {
        const { status, search, sortBy = 'orderedAt', order = 'desc' } = req.query;

        let query = {};

        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'orderedVehicle.make': { $regex: search, $options: 'i' } },
                { 'orderedVehicle.model': { $regex: search, $options: 'i' } },
                { 'orderedVehicle.vin': { $regex: search, $options: 'i' } }
            ];
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const orders = await OrderedVehicle.find(query)
            .sort({ [sortBy]: sortOrder })
            .lean();

        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching ordered vehicles',
            error: error.message
        });
    }
});

// GET single ordered vehicle by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await OrderedVehicle.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
});

// POST create new ordered vehicle
router.post('/', upload.fields([
    { name: 'orderImages', maxCount: 10 },
    { name: 'orderDocuments', maxCount: 5 }
]), async (req, res) => {
    try {
        const orderData = JSON.parse(req.body.data);

        // --- GENERATE ORDER NUMBER HERE ---
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');

        // Find last order for this month
        const startOfMonth = new Date(year, now.getMonth(), 1);
        const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

        const lastOrder = await OrderedVehicle.findOne({
            orderedAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ createdAt: -1 }).lean();

        let orderCount = 1;
        if (lastOrder && lastOrder.orderNumber) {
            const lastNumber = parseInt(lastOrder.orderNumber.slice(-2)); // last two digits
            orderCount = lastNumber + 1;
        }

        const countStr = orderCount.toString().padStart(2, '0');
        orderData.orderNumber = `ORD-${year}-${month}${countStr}`;
        // -----------------------------------

        // Handle uploaded images to Cloudinary
        if (req.files && req.files.orderImages) {
            const imageUploadPromises = req.files.orderImages.map(file =>
                uploadToCloudinary(file.buffer, 'ordered_vehicles/images')
            );
            const imageResults = await Promise.all(imageUploadPromises);
            orderData.orderImages = imageResults.map(result => result.secure_url);
        }

        // Handle uploaded documents to Cloudinary
        if (req.files && req.files.orderDocuments) {
            const documentUploadPromises = req.files.orderDocuments.map(file =>
                uploadToCloudinary(file.buffer, 'ordered_vehicles/documents')
            );
            const documentResults = await Promise.all(documentUploadPromises);
            orderData.orderDocuments = documentResults.map((result, index) => ({
                title: orderData.documentTitles ? orderData.documentTitles[index] : req.files.orderDocuments[index].originalname,
                url: result.secure_url
            }));
        }

        const order = new OrderedVehicle(orderData);
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});


// PUT update ordered vehicle
router.put('/:id', upload.fields([
    { name: 'orderImages', maxCount: 10 },
    { name: 'orderDocuments', maxCount: 5 }
]), async (req, res) => {
    try {
        const updateData = JSON.parse(req.body.data);

        // Handle new uploaded images to Cloudinary
        if (req.files && req.files.orderImages) {
            const imageUploadPromises = req.files.orderImages.map(file =>
                uploadToCloudinary(file.buffer, 'ordered_vehicles/images')
            );
            const imageResults = await Promise.all(imageUploadPromises);
            const newImages = imageResults.map(result => result.secure_url);
            updateData.orderImages = [...(updateData.orderImages || []), ...newImages];
        }

        // Handle new uploaded documents to Cloudinary
        if (req.files && req.files.orderDocuments) {
            const documentUploadPromises = req.files.orderDocuments.map(file =>
                uploadToCloudinary(file.buffer, 'ordered_vehicles/documents')
            );
            const documentResults = await Promise.all(documentUploadPromises);
            const newDocuments = documentResults.map((result, index) => ({
                title: updateData.documentTitles ? updateData.documentTitles[index] : req.files.orderDocuments[index].originalname,
                url: result.secure_url
            }));
            updateData.orderDocuments = [...(updateData.orderDocuments || []), ...newDocuments];
        }

        const order = await OrderedVehicle.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order updated successfully',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
});

// PATCH update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['ordered', 'in_transit', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const order = await OrderedVehicle.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Status updated successfully',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating status',
            error: error.message
        });
    }
});

// DELETE ordered vehicle
router.delete('/:id', async (req, res) => {
    try {
        const order = await OrderedVehicle.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error.message
        });
    }
});

// GET orders statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await OrderedVehicle.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$orderedVehicle.actualValue' }
                }
            }
        ]);

        const totalOrders = await OrderedVehicle.countDocuments();

        res.json({
            success: true,
            data: {
                totalOrders,
                byStatus: stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

module.exports = router;