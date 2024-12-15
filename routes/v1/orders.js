const express = require('express');
const router = express.Router();

const {
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    getOrdersByUserId
} = require('../../controllers/orderControllers');

// GET all orders
router.get('/getorders', getOrders);

// GET order by ID
router.get('/getorders/:id', getOrderById);

// GET orders by user ID
router.get('/user/:userId/orders', getOrdersByUserId);

// POST a new order
router.post('/orders', addOrder);

// UPDATE order by ID
router.put('/orders/:id', updateOrder);

// DELETE order by ID
router.delete('/orders/:id', deleteOrder);

module.exports = router;
