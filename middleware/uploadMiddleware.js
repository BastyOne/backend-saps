import multer, { memoryStorage } from 'multer';
const upload = multer({ storage: memoryStorage() });
export default upload;
