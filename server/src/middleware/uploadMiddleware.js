import multer, { diskStorage } from 'multer';
import { extname } from 'path';
import { promises as fs } from 'fs';

// Set up Multer for file uploads
const storage = diskStorage({
    destination: async (req, file, cb) => {
      const userId = req.userId;
      const uploadPath = `uploads/${userId}`;

      try {
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (err) {
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

export default upload;