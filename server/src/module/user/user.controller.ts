import { Request, Response } from 'express'
import catchAsync from "../../middleware/catchasync.middleware";
import { LoginDto, SignupDto } from '../../dto/user.dto';
import AuthService from "./user.service";
// import { AuthRequest } from '../../types/request.types';



const authController = {
    signup: catchAsync(async (req: Request, res: Response) => {
        const dto: SignupDto = req.body;
        const result = await AuthService.signup(dto);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result
        })
    }),

    login: catchAsync(async (req: Request, res: Response) => {
        const token = await AuthService.login(req.body as LoginDto);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token }
        })
    }),


    logout:catchAsync(async (req: Request, res: Response) => {
        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        })
    })
    
}

export default authController;