const mongoose = require('mongoose');

const userprobleMSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    problemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Problem',
        required:true
    },
    submissions:{
        type: Number,
        default: 0
    },
    result:{
        type: String,
        required: true
    }
})