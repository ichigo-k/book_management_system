import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js"

const app = express();


const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressEjsLayouts);
app.use(express.static(join(__dirname, 'public')));


app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
