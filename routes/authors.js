import express from "express";
const router = express.Router();
import Author from "../models/author.js";

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
router.post('/',async (req,res)=>{

    try {
        const { name } = req.body;

        const author = new Author({
            name: name
        });

        const newAuthor = await author.save();
        console.log(newAuthor);
        res.redirect("/authors");
        // res.redirect(`/authors/${newAuthor.id}`)

    } catch (err) {
        console.error("Error saving author:", err);
        res.render('authors/new', {
            author: { name: req.body.Name },
            errorMessage: "Error creating Author"
        });
    }
})


export default router; 