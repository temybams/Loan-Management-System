import express from 'express'
import userRoutes from '../module/user/user.route';
import loanRoutes from '../module/loan/loan.route';

const authRoutes = express.Router();

authRoutes.use('/users', userRoutes);
authRoutes.use('/loans', loanRoutes);

export default authRoutes;
