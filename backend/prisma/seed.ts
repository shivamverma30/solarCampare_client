import { AdminRole, AccountStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding.");
    process.exit(1);
  }

  const existingAdmins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
    take: 2,
    select: { id: true, email: true },
  });

  if (existingAdmins.length > 1) {
    console.warn(
      `⚠️ Multiple Admin records already exist (${existingAdmins.map((admin) => admin.email).join(", ")}). Seeding skipped to avoid creating a duplicate.`
    );
    return;
  }

  if (existingAdmins.length === 1) {
    const [existingAdmin] = existingAdmins;

    if (existingAdmin.email === adminEmail) {
      console.log(`ℹ️ Admin already exists with the configured email: ${adminEmail}`);
    } else {
      console.warn(
        `⚠️ An Admin already exists with a different email (${existingAdmin.email}). No new Admin was created.`
      );
    }

    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.create({
    data: {
      email: adminEmail,
      singletonKey: "SOLE_ADMIN",
      password: hashedPassword,
      name: "Admin User",
      role: AdminRole.SUPERADMIN,
      status: AccountStatus.ACTIVE,
    },
  });

  console.log(`✅ Admin created: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });