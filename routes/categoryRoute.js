const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
router.use(express.json());
const categoryController = require("../controllers/CategoryController");

router.post("/", categoryController.createCategory);

router.get("/", categoryController.getAllCategory);

router.get("/select", categoryController.getCategoryWithout);

router.get("/:id", categoryController.findCategorysById);
router.put("/:id", categoryController.updateCategorysById);

router.delete("/:id", categoryController.deleteCategorysById);

module.exports = router;
