import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js"
import mongoose from "mongoose"
import "dotenv/config";


const app = express();


const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressEjsLayouts);
app.use(express.static(join(__dirname, 'public')));

mongoose.connect(process.env.DATABASEURL);

const db = mongoose.connection;
db.on('error', error =>console.log(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
