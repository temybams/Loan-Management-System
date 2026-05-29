import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const fullName = process.env.ADMIN_FULL_NAME ?? "System Admin";
  const phoneNumber = process.env.ADMIN_PHONE_NUMBER ?? "+2348012345678";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding an admin account.");
  }

  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD should be at least 10 characters long.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      username,
      fullName,
      phoneNumber,
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      username,
      email,
      password: hashedPassword,
      fullName,
      dateOfBirth: new Date("1990-01-01"),
      phoneNumber,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin account ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
