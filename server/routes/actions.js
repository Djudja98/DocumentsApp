import express from 'express';
import auth from '../middleware/auth.js';
import { getActions, createAction } from '../controllers/actions.js';

const router = express.Router();

router.get('/',auth, getActions);
router.post('/create',auth,createAction);


export default router;