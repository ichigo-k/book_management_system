
import multer from "multer";
import path from "path";

let uploadPath="";

export default function uploadMiddleware (path){
    uploadPath = path;
}


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        // Extract the original file extension
        const ext = path.extname(file.originalname);
        // Generate a unique name for the file
        const filename = `${file.fieldname}-${Date.now()}${ext}`;
        callback(null, filename);
    }
});

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
export const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (imageMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Only image files are allowed!'), false);
        }
    }
});