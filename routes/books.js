import express from "express";
import Book, { coverImagePath } from "../models/book.js";
import Author from "../models/author.js";
import path from "path";
import fs from "fs";
import uploadMiddleware, {upload} from "../middleware/uploadMiddleware.js";


const router = express.Router();
const uploadPath = path.join("public", coverImagePath);
uploadMiddleware(uploadPath);

// All Books Route
router.get("/", async (req, res) => {
    let query = Book.find();

    if(req.query.title && req.query.title !=" "){
        query = query.regex('title', new RegExp(req.query.title, "i"));
    }

    if(req.query.publishedBefore && req.query.publishedBefore !=" "){
        query = query.lte("publishDate" , req.query.publishedBefore)
    }


    if(req.query.publishedAfter && req.query.publishedAfter !=" "){
        query = query.gte("publishDate" , req.query.publishedAfter)
    }

    try {
        const books = await query.exec();

       
        res.render("books/index", {
            books:books,
            search:req.query
        });
    } catch (error) {
        res.redirect("/")
    }
});

// New Book Route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Book());
});

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        pageCount: req.body.pageCount,
        coverImage: fileName, 
        publishDate: new Date(req.body.publishedDate)
    });

    try {
        const newBook = await book.save();
        res.redirect("/books");
    } catch (error) {
        console.error("Error creating book: ", error);
        if(book.coverImage !== null){
            removeBoockCover(book.coverImage);
        }
        
        renderNewPage(res, book, true);
    }
});

// Helper function to render the new book page with or without errors
async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };

        if (hasError) params.errorMessage = "Error creating book";
        res.render("books/new", params);
    } catch (error) {
        console.error("Something went wrong: ", error);
        res.redirect("/books");
    }
}


function removeBoockCover(filename){
    fs.unlink(path.join(uploadPath, filename), err =>{
        console.log(err);
    })
}

export default router;
