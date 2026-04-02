import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
        data: {
            username: "admin",
            email: "bamisitemitope@gmail.com",
            password: hashedPassword,
            fullName: "System Admin",
            dateOfBirth: new Date("1990-01-01"),
            phoneNumber: "08137341838",
            role: Role.ADMIN,
        },
    });

    console.log("✅ Admin created");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });