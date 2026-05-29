import bcrypt from "bcryptjs";
import httpStatus from 'http-status'
import { Role } from "@prisma/client";
import { prisma } from "../../services/prisma.service";
import JWTService from "../../services/jwtServices";
import { SignupDto, LoginDto } from "../../dto/user.dto";
import throwError from '../../utils/error'

const AuthService = {
    signup: async (dto: SignupDto) => {
        const { username, email, password, fullName, dateOfBirth, phoneNumber, street, city, state, postalCode, country, role } = dto

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw throwError('User already exists', httpStatus.CONFLICT)
        };

        // prevent admin creation

        if (role === "ADMIN") {
            throw throwError('Unauthorized to create admin', httpStatus.FORBIDDEN)
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let assignedRole: Role = Role.BORROWER;

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                fullName,
                dateOfBirth: new Date(dateOfBirth),
                phoneNumber,
                street,
                city,
                state,
                postalCode,
                country,
                role: Role.BORROWER,
            },
        });


        const { password: _password, ...safeUser } = user;

        return {
            user: safeUser,
        };
    },

    login: async (dto: LoginDto) => {
        const { email, password } = dto;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throwError("Invalid credentials", httpStatus.UNAUTHORIZED);

        const isMatch = await bcrypt.compare(password, user!.password);
        if (!isMatch) throwError("Invalid credentials", httpStatus.UNAUTHORIZED);

        const token = JWTService.sign({
            id: user!.id,
            role: user!.role,
        });


        return { user, token };

    }

}

export default AuthService;