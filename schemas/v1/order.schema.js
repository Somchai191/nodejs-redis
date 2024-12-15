const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true, 
        description: "ID ของผู้ใช้ที่สั่งซื้อ"
    },
    orderDate: { 
        type: Date, 
        default: Date.now, 
        description: "วันที่และเวลาที่คำสั่งซื้อถูกสร้าง"
    },
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Products', 
                required: true, 
                description: "ID ของสินค้าที่สั่งซื้อ"
            },
            name: { 
                type: String, 
                required: true, 
                description: "ชื่อของสินค้า" 
            },
            quantity: { 
                type: Number, 
                required: true, 
                min: 1, 
                description: "จำนวนสินค้าที่สั่งซื้อ"
            },
            price: { 
                type: Number, 
                required: true, 
                min: 0, 
                description: "ราคาต่อหน่วยของสินค้า"
            }
        }
    ],
    totalAmount: { 
        type: Number, 
        required: true, 
        description: "ยอดรวมของคำสั่งซื้อ"
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending', 
        description: "สถานะของคำสั่งซื้อ"
    },
    shippingAddress: {
        street: { type: String, required: true, description: "ที่อยู่ถนนสำหรับจัดส่ง" },
        city: { type: String, required: true, description: "เมืองสำหรับจัดส่ง" },
        state: { type: String, required: true, description: "รัฐหรือจังหวัดสำหรับจัดส่ง" },
        postalCode: { type: String, required: true, description: "รหัสไปรษณีย์" },
        country: { type: String, required: true, description: "ประเทศสำหรับจัดส่ง" }
    }
});

module.exports = mongoose.model('Order', orderSchema);
