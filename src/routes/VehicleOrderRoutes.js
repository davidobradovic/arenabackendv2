// routes/vehicleOrders.js
const express = require("express");
const VehicleOrder = require("../models/VehicleOrders");
const router = express.Router();

// ✅ Create new vehicle order
router.post("/", async (req, res) => {
    try {
        const order = new VehicleOrder(req.body);
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Get all vehicle orders (with pagination, sorting, filtering)
router.get("/", async (req, res) => {
    try {
        let { page = 1, per_page = 10, sort = "-createdAt", status } = req.query;

        page = parseInt(page);
        per_page = parseInt(per_page);

        const query = {};
        if (status) query.status = status; // filter by status if provided

        const total = await VehicleOrder.countDocuments(query);
        const orders = await VehicleOrder.find(query)
            .populate("createdBy", "name email") // optional populate user
            .sort(sort)
            .skip((page - 1) * per_page)
            .limit(per_page);

        res.json({
            data: orders,
            meta: {
                total,
                page,
                per_page,
                last_page: Math.ceil(total / per_page),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get single order by ID
router.get("/:id", async (req, res) => {
    try {
        const order = await VehicleOrder.findById(req.params.id).populate("createdBy", "name email");
        if (!order) return res.status(404).json({ error: "Vehicle order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update order
router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await VehicleOrder.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedOrder) return res.status(404).json({ error: "Vehicle order not found" });
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Delete order
router.delete("/:id", async (req, res) => {
    try {
        const deletedOrder = await VehicleOrder.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ error: "Vehicle order not found" });
        res.json({ message: "Vehicle order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
