import { diskStorage } from 'multer';
import * as fs from 'fs';
import { join } from 'path';

export const storageConfig = (folder: string) =>
  diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join('./public', folder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });

export const addIndexToFileName = (fileName: string, index: number) => {
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) {
    // no extension, just append
    return `${fileName} (${index})`;
  }

  const name = fileName.substring(0, dotIndex); // "3_001"
  const ext = fileName.substring(dotIndex); // ".jpg"

  return `${name} (${index})${ext}`;
};
