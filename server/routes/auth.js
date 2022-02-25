import express from 'express';
import { signinAppKorisnici, sendQrCodeAppKorisnici, signinAppDokumenti, sendQrCodeAppDokumenti} from '../controllers/auth.js';

const router = express.Router();

router.post('/signinqr', sendQrCodeAppKorisnici);

router.post('/signinak', signinAppKorisnici);

router.post('/signinad', signinAppDokumenti);

router.post('/signinqrad', sendQrCodeAppDokumenti);

export default router;