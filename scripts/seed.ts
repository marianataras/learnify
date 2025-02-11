const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    const categories = [
      {
        name: "IT-технології",
        subCategories: {
          create: [
            { name: "Web Development" },
            { name: "Data Science" },
            { name: "Cybersecurity" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Бізнес",
        subCategories: {
          create: [
            { name: "E-Commerce" },
            { name: "Marketing" },
            { name: "Finance" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Дизайн",
        subCategories: {
          create: [
            { name: "Graphic Design" },
            { name: "3D & Animation" },
            { name: "Interior Design" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Здоров'я",
        subCategories: {
          create: [
            { name: "Fitness" },
            { name: "Yoga" },
            { name: "Nutrition" },
            { name: "Others" },
          ],
        },
      },
    ];

    // Sequentially create each category with its subcategories
    for (const category of categories) {
      await database.category.create({
        data: {
          name: category.name,
          subCategories: category.subCategories,
        },
        include: {
          subCategories: true,
        },
      });
    }

    await database.level.createMany({
      data: [
        { name: "Початковий" },
        { name: "Середній" },
        { name: "Експертний" },
        { name: "Усі рівні" },
      ],
    });

    console.log("Дані успішно додані");
  } catch (error) {
    console.log("Не вдалося додати дані", error);
  } finally {
    await database.$disconnect();
  }
}

main();