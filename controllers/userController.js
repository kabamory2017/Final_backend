const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.createUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    if (!req.body.username) {
      return res.status(422).json({ error: "field username is required" });
    }
    if (!req.body.password) {
      return res.status(422).json({ error: "field password is required" });
    }
    if (!req.body.email) {
      return res.status(422).json({ error: "field email is required" });
    }

    if (await User.findOne({ email: req.body.email })) {
      return res
        .status(409)
        .json({ message: `User${username} already exist ` });
    }
    const newUser = await User.create(req.body);
    return res.status(201).json({ data: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const all_datas = await User.find();
    res.status(200).json({ users: all_datas });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.getUsersWithout = async (req, res) => {
  try {
    const all_datas = await User.find().select("_id username email");
    res.status(200).json({ all_data: all_datas });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.findUsersById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(422).json({ message: "not a good id" });
    }
    const all_datas = await User.findById(req.params.id);
    if (!all_datas) {
      return res.status(404).json({ error: "not found" });
    }
    res.status(200).json({ element_received: all_datas });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
const createToken = (id, username, email, role) => {
  return jwt.sign(
    { userId: id, userName: username, userEmail: email, role: role },
    process.env.SECRET,
    { expiresIn: "10d" }
  );
};
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!req.body.username) {
    return res.status(422).json({ message: "username is required" });
  }
  if (!req.body.email) {
    return res.status(422).json({ message: "email is required" });
  }
  if (!req.body.password) {
    return res.status(422).json({ message: "password is required" });
  }
  if (!req.body.password) {
    return res.status(422).json({ message: "password is required" });
  }

  const exist = await User.findOne({ email: req.body.email });
  if (exist) {
    return res.status(409).json({ message: "email already exist " });
  }
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hash,
      role,
    });
    const token = createToken(
      newUser._id,
      newUser.name,
      newUser.email,
      newUser.role
    );
    return res.status(201).json({
      message: "user created succes",
      UserInfo: {
        username: req.body.username,
        email: req.body.email,
        usertoken: token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!req.body.email) {
    return res.status(422).json({ message: "email is required" });
  }
  if (!req.body.password) {
    return res.status(422).json({ message: "password is required" });
  }

  const exist = await User.findOne({ email: req.body.email });
  if (!exist) {
    return res.status(409).json({ message: "email or password incorrect " });
  }
  try {
    const checkPassword = await bcrypt.compare(password, exist.password);
    if (!checkPassword) {
      res.json({
        message: "password incorrect",
      });
    } else {
      const token = createToken(exist._id, exist.name, exist.email, exist.role);
      res.status(200).json({
        message: `connection succcess ${email}`,
        usertoken: token,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// exports.updateUsersById= async(req,res)=>{
//     if(!mongoose.isValidObjectId(req.params.id)){
//         return res.status(422).json({message: "not a good id"})
//     }
//     if(!await User.findOne({_id: req.params.id})){
//         return res.status(404).json({message: "Usernot found"})
//     }
//     try {

//         const all_datas = await User.findByIdAndUpdate(req.params.id, req.body,{new:true})

//         // if(!all_datas){
//         //   return  res.status(404).json({error: "not found"})
//         // }
//         res.status(200).json({element_received:all_datas})
//     } catch (error) {
//         return res.status(500).json({message: error.message})
//     }

// }

exports.deleteUserById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(422).json({ message: "not a good id" });
    }
    // if(!req.body.email){
    //     return res.status(422).json({message:"email is required"})
    // }
    if (!(await User.exists({ _id: req.params.id }))) {
      return res.status(404).json({ message: "user not exist" });
    }
    const all_datas = await User.findByIdAndDelete(req.params.id);

    // if(!all_datas){
    //   return  res.status(404).json({error: "not found"})
    // }
    return res.status(201).json({ element_received: "delete succes" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "please provide an email" });
    }
    const checkUser = await User.findOne({ email: email });
    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "user not exist please register" });
    }
    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "10d" });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const receiver = {
      from: "kabamory103@gmail.com",
      to: email,
      subject: "passzord resset",
      text: `click to reset ${process.env.CLIENT_URL}/reset-password/
        ${token}`,
    };
    await transporter.sendMail(receiver);
    res.status(400).send({ message: "mail succes send" });
  } catch (error) {}
};
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).send({ message: "please provide password" });
    }
    const decode = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ email: decode.email });
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await user.save();
    return res.status(200).json({ element_received: "password update succes" });
  } catch (error) {
    return res.status(500).send({ message: token });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "please provide new password" });
    }
    if (!email) {
      return res.status(400).json({ message: "please provide email" });
    }
    if (!currentPassword) {
      return res
        .status(400)
        .json({ message: "please provide your curent password" });
    }

    const exist = await User.findOne({ email: email });
    if (!exist) {
      return res.status(409).json({ message: "email or password incorrect " });
    }

    const checkPassword = await bcrypt.compare(currentPassword, exist.password);
    if (!checkPassword) {
      res.json({
        message: "password incorrect",
      });
    } else {
      const hash = await bcrypt.hash(newPassword, 10);
      await User.updateOne({ email }, { password: hash });
      return res.status(200).json({ message: "password change succes" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
