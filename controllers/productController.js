const mongoose = require("mongoose");
const Product = require("../models/Products");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createProduct = async (req, res) => {
  const { name, price, quantity, category } = req.body;
  // res.json({data:req.user})
  if (!req.body.name) {
    return res.status(422).json({ error: "field name is required" });
  }
  // if(!req.body.user){
  //     return res.status(422).json({error:'field users is required'})
  // }
  if (!req.body.price) {
    return res.status(422).json({ error: "field price is required" });
  }
  // if(!await User.findOne({_id:req.userId})){
  //     return res.status(422).json({error:'user not exist'})
  // }
  if (!req.body.category) {
    return res.status(422).json({ error: "field category is required" });
  }
  if (!(await Category.findById(req.body.category))) {
    return res.status(422).json({ error: "category not not found" });
  }
  if (await Product.findOne({ name: req.body.name })) {
    return res
      .status(409)
      .json({ message: "product ${req.body.name} already exist " });
  }

  try {
    const current = await User.findOne({ _id: req.user.userId });
    const newProduct = await Product.create({
      name,
      price,
      quantity,
      category: req.body.category,
      user: current.id,
    });
    return res.status(201).json({
      message: "success products create",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const all_datas = await Product.find()
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "user", select: "_id name email" });
    res.status(200).json({ success: true, all_data: all_datas });
  } catch (error) {
    return res.status(500).json({ success: true, message: error });
  }
};

exports.getProductsWithout = async (req, res) => {
  try {
    const all_datas = await Product.find()
      .select("_id name price")
      .populate({ path: "user", select: "_id name email" });
    res.status(200).json({ all_data: all_datas });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
exports.getProductsByUser = async (req, res) => {
  // if(!await User.findOne({_id:req.p4.id})){
  //     return res.status(422).json({error:'user not exist'})
  // }
  try {
    const all_datas = await Product.find({ user: req.params.id })
      .select("_id name price")
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "user", select: "_id name email" });
    res.status(200).json({ success: true, all_data: all_datas });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.findProductsById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(422).json({ message: "not a good id" });
    }
    const all_datas = await Product.findById(req.params.id).populate({
      path: "category",
      select: "_id name",
    });
    if (!all_datas) {
      return res.status(404).json({ error: "not found" });
    }
    res.status(200).json({ element_received: all_datas });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
exports.updateProductsById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(422).json({ message: "not a good id" });
  }
  if (!(await Product.findOne({ _id: req.params.id }))) {
    return res.status(404).json({ message: "product not found" });
  }
  try {
    const all_datas = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // if(!all_datas){
    //   return  res.status(404).json({error: "not found"})
    // }
    res.status(200).json({ element_received: all_datas });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteProductsById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(422).json({ message: "not a good id" });
    }
    const checkPost = await Product.exists({ _id: req.params.id });
    if (!checkPost) {
      return res.status(404).json({ message: "products not found" });
    }

    // const p = await User.findById(req.user.id)

    // if(!checkPost.user.equals(p._id)){
    //     return res.status(500).json({message: "it is not your post"})
    // }
    const all_datas = await Product.findByIdAndDelete(req.params.id);

    // if(!all_datas){
    //   return  res.status(404).json({error: "not found"})
    // }
    return res.status(201).json({
      success: true,
      element_received: "delete succes",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteProductsByIdWithToken = async (req, res) => {
  // res.json(req.user)
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(422).json({ message: "not a good id" });
    }
    const checkPost = await Product.exists({ _id: req.params.id });
    if (!checkPost) {
      return res.status(404).json({ message: "products not found" });
    }
    const all_d = await Product.findOne({ _id: req.params.id });
    // const current = await User.findOne({_id:req.user.userId})
    if (all_d.user.toString() !== req.user.userId) {
      return res.status(500).json({ message: "it is not your post" });
    }

    // const p = await User.findById(req.user.id)
    // if(req.user._id!=checkPost.user._id){
    //     return res.status(500).json({message: "it is not your post"})
    // }

    // if(!checkPost.user.equals(p._id)){
    //     return res.status(500).json({message: "it is not your post"})
    // }
    const all_datas = await Product.findByIdAndDelete(req.params.id);

    // if(!all_datas){
    //   return  res.status(404).json({error: "not found"})
    // }
    return res.status(201).json({ element_received: "delete succes" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
