const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../../schemas/v1/product.schema');


const {
    getpro,
    addpro,
    updatepro,
    deletepro
  } = require("../../controllers/productControllers");

// GET all products
router.get("/get",getpro);
// get id product
router.get("/get/:id",getpro);

// POST a new product
router.post("/addpro",addpro);

// Update product
router.put("/update/:id",updatepro);

// Update product
router.delete("/delete/:id",deletepro);

module.exports = router;