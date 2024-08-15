const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
router.use(express.json());
const upload = require("..//midlware/upload");

const productController = require("../controllers/productController");
const auth = require("../midlware/auth");
const authAdmin = require("../midlware/admin");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post(
  "/",
  auth(["admin"]),
  upload.single("file"),
  productController.createProduct
);

// router.get("/",auth,productController.getAllProducts)
router.get("/", auth(["admin"]), productController.getAllProducts);

router.get("/select", productController.getProductsWithout);
router.get("/user/:id", productController.getProductsByUser);

router.get("/:id", productController.findProductsById);
router.put("/:id", productController.updateProductsById);

router.delete("/tok/:id", auth, productController.deleteProductsByIdWithToken);
router.delete("/:id", productController.deleteProductsById);

module.exports = router;
