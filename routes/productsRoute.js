const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
router.use(express.json());

const productController = require("../controllers/productController");
const auth = require("../midlware/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/", auth, productController.createProduct);

// router.get("/",auth,productController.getAllProducts)
router.get("/", productController.getAllProducts);

router.get("/select", productController.getProductsWithout);
router.get("/user/:id", productController.getProductsByUser);

router.get("/:id", productController.findProductsById);
router.put("/:id", productController.updateProductsById);

router.delete("/tok/:id", auth, productController.deleteProductsByIdWithToken);
router.delete("/:id", productController.deleteProductsById);

module.exports = router;
