import mongoose from "mongoose";
import path from "path";


export const coverImagePath = "uploads/bookCovers";

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    publishDate:{
        type:Date,
        required:true,
    },
    pageCount :{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    coverImage:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Author"
    }

});

bookSchema.virtual("coverImageURL").get(function(){
    if(this.coverImage){
        return path.join("/",coverImagePath, this.coverImage)
    }
})


export default mongoose.model('Book', bookSchema);

