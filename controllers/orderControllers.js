const Order = require('../schemas/v1/order.schema');

// GET all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('products.productId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
    }
};

// GET order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id).populate('userId').populate('products.productId');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order", error: error.message });
    }
};

// GET orders by user ID
const getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ userId }).populate('products.productId');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
    }
};

// POST a new order
const addOrder = async (req, res) => {
    const { userId, products, totalPrice, status } = req.body;

    if (!userId || !products || !totalPrice) {
        return res.status(400).json({ message: "Required fields: userId, products, totalPrice" });
    }

    try {
        const newOrder = new Order({
            userId,
            products,
            totalPrice,
            status: status || "pending", // Default status
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

// UPDATE order by ID
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order", error: error.message });
    }
};

// DELETE order by ID
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete order", error: error.message });
    }
};

module.exports = {
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    getOrdersByUserId,
};
