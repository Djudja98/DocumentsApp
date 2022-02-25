import express from 'express';
import {uploadFile, downloadFile, listFiles, deleteFile, moveFile, createDir, deleteDir} from '../controllers/files.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/upload', auth,uploadFile);

router.get('/download',auth,downloadFile);

router.get('/list',auth ,listFiles);

router.delete('/delete',auth,deleteFile);

router.patch('/move',auth, moveFile);

router.post('/createDir', auth, createDir);

router.post('/deleteDir',auth,deleteDir);

export default router;