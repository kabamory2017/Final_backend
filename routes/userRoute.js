const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../midlware/auth");
const jwt = require("jsonwebtoken");
router.use(express.json());
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/forget-password", userController.forgetPassword);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/change-password", userController.changePassword);

router.get("/", userController.getAllUser);

router.get("/select", userController.getUsersWithout);

// router.get("/:id",userController.findUsersById)
// router.put("/:id",userController.updateUsersById)

router.delete("/:id", auth, userController.deleteUserById);

module.exports = router;
