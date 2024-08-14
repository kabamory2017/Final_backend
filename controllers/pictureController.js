const mongoose = require('mongoose')
const Picture = require('../models/Picture')
exports.createPicture = async (req, res) => {
    try {
        const product = new Picture({
            name: req.body.name,
            desc: req.body.desc,
            avatar: req.file ? req.file.path : null
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPicture = async(req,res)=>{
    try {
        const all_datas = await Picture.find()
        res.status(200).json({  success:true,all_data:all_datas})
    } catch (error) {
        return res.status(500).json({message: error})
    }

}