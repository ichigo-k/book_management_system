import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose"
import "dotenv/config";
import axios from "axios";
import cron from "node-cron";
import bodyParser from "body-parser";

import indexRouter from "./routes/index.js"
import authorRouter from "./routes/authors.js"
import bookRouter from "./routes/books.js"


const app = express();


const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressEjsLayouts);
app.use(express.static(join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit:'10mb', extended:false}))
mongoose.connect(process.env.DATABASEURL);

const db = mongoose.connection;
db.on('error', error =>console.log(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);


const apiUrl = process.env.APPURL ;


async function makeApiRequest() {
  try {
    const response = await axios.get(apiUrl);
  } catch (error) {
    console.error('Error making API request:', error.message);
  }
}

cron.schedule('*/3 * * * *', () => {
  console.log('Making API request...');
  makeApiRequest();
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
