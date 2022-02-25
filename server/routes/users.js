import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/users.js'; 
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/',auth, getUsers);
router.post('/',auth, createUser);
router.patch('/:id',auth, updateUser);
router.delete('/:id',auth, deleteUser);

export default router;