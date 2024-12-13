const express = require('express');
const router = express.Router();


const {
    getpro,
    addpro,
    updatepro,
    deletepro,
    getProductById
  } = require("../../controllers/productControllers");

// GET all products
router.get("/get",getpro);
// get id product
router.get("/get/:id",getProductById);

// POST a new product
router.post("/addpro",addpro);

// Update product
router.put("/update/:id",updatepro);

// Update product
router.delete("/delete/:id",deletepro);

module.exports = router;