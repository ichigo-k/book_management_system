import express from "express";
const router = express.Router();
import Author, {ProfilePicPath}from "../models/author.js";
import uploadMiddleware,{upload} from "../middleware/uploadMiddleware.js";
import path from "path";


const uploadPath = path.join("public",ProfilePicPath );
uploadMiddleware(uploadPath)

// All Authors Route
router.get("/",async  (req,res)=>{
    let options ={}

    if(req.query.name !== null && req.query.name !==" "){
        options.name = new RegExp(req.query.name);
    }

    

    try {
        const authors = await  Author.find(options);
        res.render("authors/index", {
            authors: authors,
            search:  req.query.name,
        });

    } catch (error) {
        res.redirect("/")
    }
   
})

// New Author Route
router.get("/new", (req,res)=>{
    res.render('authors/new', {author: new Author()})
})

// Create Author route
router.post('/',upload.single('picture'),async (req,res)=>{

    const fileName = req.file ? req.file.filename : null;

    console.log(fileName)
    const { name } = req.body;

    const author = new Author({
        name: name,
        profilePic:fileName
    });

    try {
        const newAuthor = await author.save();
        console.log(newAuthor);
        res.redirect("/authors");
        // res.redirect(`/authors/${newAuthor.id}`)

    } catch (err) {
        console.error("Error saving author:", err);
        
        if(author.profilePic){
            removeBoockCover(author.profilePic, uploadPath)
        }
        res.render('authors/new', {
            author: { name: req.body.Name },
            errorMessage: "Error creating Author"
        });
    }
})


function removeBoockCover(filename){
    fs.unlink(path.join(uploadPath, filename), err =>{
        console.log(err);
    })
}

export default router; 