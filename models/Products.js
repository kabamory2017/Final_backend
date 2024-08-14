const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    description:{
        type: String
    },
    price:{
        type:Number,
        require:true
    },
    quantity:{
        type: Number,
        default:0
    },
    // active:{
    //     type:Boolean,
    //     default: true
    // },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:true
    }

},{
    timestamps:true
})

module.exports = mongoose.model('Product',productSchema)