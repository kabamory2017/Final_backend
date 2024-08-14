const mongoose = require('mongoose')
const Category = require('../models/Category')

exports.createCategory = async(req,res)=>{

    try {
        if(!req.body.name){
            throw new Error("check please")
            return res.status(422).json({error:'field name is required'})
        }
        if(await Category.findOne({name:req.body.name})){
            return res.status(409).json({message: 'category ${req.body.name} already exist '})
        }
        
        const newCategory = await Category.create(req.body)
        return res.status(201).json({
            message: `categorie ${req.body.name} success create`,
            data: newCategory})
    } catch (error) {
        return res.status(500).json({message: error})
    }
   
  
   
}

exports.getAllCategory = async(req,res)=>{
    try {
        const all_datas = await Category.find()
        res.status(200).json({all_data:all_datas})
    } catch (error) {
        return res.status(500).json({message: error})
    }

}

exports.getCategoryWithout = async(req,res)=>{
    try {
        const all_datas = await Category.find().select('_id name')
        res.status(200).json({all_data:all_datas})
    } catch (error) {
        return res.status(500).json({message: error})
    }

}

exports.findCategorysById = async(req,res)=>{
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(422).json({message: "not a good id"})
        }
        
        const all_datas = await Category.findById(req.params.id)
        if(!all_datas){
          return  res.status(404).json({error: "category not found"})
        }
        res.status(200).json({element_received:all_datas})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}
exports.updateCategorysById= async(req,res)=>{
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(422).json({message: "not a good id"})
        }
        if(!req.body.name){
            return res.status(422).json({error:'field name is required'})
        }
        if(!await Category.exists({_id: req.params.id})){
            return res.status(404).json({message: "category not found"})
        }else{
            const all_datas = await Category.findByIdAndUpdate(req.params.id, req.body,{new:true})
            res.status(200).json({message:"success updated",element_received:all_datas})
        }
        

        // if(!all_datas){
        //   return  res.status(404).json({error: "not found"})
        // }
       
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

exports.deleteCategorysById= async(req,res)=>{
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(422).json({message: "not a good id"})
        }
        if(!await Category.exists({_id: req.params.id})){
            return res.status(404).json({message: "categories not found"})
        }else{
            const all_datas = await Category.findByIdAndDelete(req.params.id)
            return res.status(201).json({element_received:`${req.params.id} delete succes`})
        }
        

        // if(!all_datas){
        //   return  res.status(404).json({error: "not found"})
        // }
       
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}
