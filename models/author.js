import mongoose from "mongoose";
import path from "path";

export const ProfilePicPath = process.env.BookPath || "uploads/bookCovers"

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    profilePic:{
        type:String,
        required:true
    }
});

authorSchema.virtual("ProfilePicURL").get(function(){
    if(this.profilePic){
        return path.join("/",ProfilePicPath, this.profilePic)
    }
})



export default mongoose.model('Author', authorSchema);

