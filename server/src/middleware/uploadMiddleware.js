import multer, { diskStorage } from 'multer';
import { extname, join } from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { MEDIA_THUMBNAIL_PREFIX, PROFILE_PIC_THUMBNAIL_PREFIX, UPLOAD_DIR } from '../common/utils.js';

// Set up Multer for file uploads
const storage = diskStorage({
    destination: async (req, file, cb) => {
      const userId = req.userId;
      const uploadPath = `${UPLOAD_DIR}/${userId}`;

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

export const uploadMiddleware = multer({ storage: storage });

export const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const { userId } = req;
  const uploadDir = `${UPLOAD_DIR}/${userId}`;
  const thumbnailName = `${PROFILE_PIC_THUMBNAIL_PREFIX}${req.file.filename}`;
  const thumbnailPath = join(uploadDir, thumbnailName);

  try {
    // Use sharp to create a thumbnail
    await sharp(filePath)
      .resize({ width: 200 }) // Adjust the width for the thumbnail
      .rotate()
      .toFile(thumbnailPath);

    // Add paths to the req object for use in the next middleware or route handler
    req.filePaths = {
      original: filePath,
      thumbnail: thumbnailPath
    };

    next();
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    res.status(500).json({ message: 'Error processing the image' });
  }
};

export const createMediaThumbnail = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const { userId } = req;
  const uploadDir = `${UPLOAD_DIR}/${userId}`;
  const thumbnailName = `${MEDIA_THUMBNAIL_PREFIX}${req.file.filename}`;
  const thumbnailPath = join(uploadDir, thumbnailName);

  try {
    // Use sharp to create a thumbnail
    await sharp(filePath)
      .resize({ width: 400 }) // Adjust the width for the thumbnail
      .rotate()
      .toFile(thumbnailPath);

    // Add paths to the req object for use in the next middleware or route handler
    req.filePaths = {
      original: filePath,
      thumbnail: thumbnailPath
    };

    next();
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    res.status(500).json({ message: 'Error processing the image' });
  }
};
