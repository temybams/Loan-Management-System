import express from 'express'
import userRoutes from '../module/user/user.route';

const authRoutes = express.Router();

authRoutes.use('/users', userRoutes);

export default authRoutes;
