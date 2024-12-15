const Order = require('../schemas/v1/order.schema');

// GET all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('items.productId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
    }
};

// GET order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id).populate('userId').populate('items.productId');
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
        const orders = await Order.find({ userId }).populate('items.productId');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
    }
};

// POST a new order
const Product = require('../schemas/v1/product.schema');
const User = require('../schemas/v1/user.schema'); // นำเข้าโมเดล User

const addOrder = async (req, res) => {
    const { userId, items, status, shippingAddress } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!userId || !items || !shippingAddress) {
        return res.status(400).json({ message: "Required fields: userId, items, shippingAddress" });
    }

    try {
        // ดึงข้อมูลสินค้า (name และ price) สำหรับแต่ละ productId ที่ส่งมา
        const updatedItems = [];
        let calculatedTotalAmount = 0;

        for (let item of items) {
            // ดึงข้อมูลจากฐานข้อมูล 'Product' โดยใช้ 'productId'
            const product = await Product.findById(item.productId);

            if (product) {
                // คำนวณราคา: ราคา * จำนวนสินค้า
                const itemTotalPrice = product.price * item.quantity;

                updatedItems.push({
                    productId: item.productId,
                    name: product.name,       
                    price: product.price,     
                    quantity: item.quantity,  
                    totalPrice: itemTotalPrice, 
                });

                calculatedTotalAmount += itemTotalPrice;
            } else {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
        }

        // สร้างคำสั่งซื้อใหม่
        const newOrder = new Order({
            userId,
            items: updatedItems,
            totalAmount: calculatedTotalAmount,
            status: status || "Pending",
            shippingAddress,
        });

        // บันทึกคำสั่งซื้อใหม่
        await newOrder.save();

        // ดึงข้อมูลผู้ใช้ (name, email) หลังจากบันทึกคำสั่งซื้อเสร็จ
        const orderWithUserDetails = await Order.findById(newOrder._id)
            .populate('userId', 'name email')  // ดึงข้อมูล 'name' และ 'email' จาก User
            .exec();

        res.status(201).json({ message: "Order created successfully", order: orderWithUserDetails });
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
