import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Ensure the default admin account always exists with the expected password.
  const hashedPassword = await hashPassword("Admin@123");

  const admin = await prisma.admin.upsert({
    where: { email: "admin@solar.com" },
    update: {
      password: hashedPassword,
      name: "Admin User",
    },
    create: {
      email: "admin@solar.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("✅ Admin ready:", admin.email);

  // Seed sample products only when the admin does not already have products.
  const existingProductCount = await prisma.product.count({
    where: { adminId: admin.id },
  });

  if (existingProductCount > 0) {
    console.log("✅ Sample products already exist. Skipping product seed.");
    console.log("\n📝 Default Admin Credentials:");
    console.log("   Email: admin@solar.com");
    console.log("   Password: Admin@123");
    return;
  }

  const products = [
    {
      title: "Goldi Solar Panel 600W",
      brand: "Goldi Solar",
      type: "Monocrystalline",
      efficiency: 21.5,
      warranty: 25,
      wattage: 600,
      description: "High-efficiency monocrystalline solar panel for residential and commercial use",
      adminId: admin.id,
    },
    {
      title: "Waaree Solar Panel 550W",
      brand: "Waaree",
      type: "Mono PERC",
      efficiency: 20.5,
      warranty: 25,
      wattage: 550,
      description: "Reliable Mono PERC technology for budget-conscious installations",
      adminId: admin.id,
    },
    {
      title: "Vikram Solar Bifacial 615W",
      brand: "Vikram Solar",
      type: "Bifacial Glass-Glass",
      efficiency: 21.73,
      warranty: 30,
      wattage: 615,
      description: "Premium bifacial technology for maximum energy generation",
      adminId: admin.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("✅ Sample products created");
  console.log("\n📝 Default Admin Credentials:");
  console.log("   Email: admin@solar.com");
  console.log("   Password: Admin@123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
