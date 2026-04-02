import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

});

export const EmailService = {
    sendEmail: async (to: string, subject: string, html: string) => {
        await transporter.sendMail({
            from: `"Loan App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    },
};
