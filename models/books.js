// We are creating a Book model here

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title:String,
    image:String,
    author:String,
    price:Number,
    description:String,
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

module.exports = mongoose.model('Book',BookSchema);