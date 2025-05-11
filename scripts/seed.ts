const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    const categories = [
      {
        name: "Особистий розвиток",
        subCategories: {
          create: [
            { name: "Тайм-менеджмент і продуктивність" },
            { name: "Публічні виступи та комунікація" },
            { name: "Лідерство і самоменеджмент" },
            { name: "Психологія та ментальне здоров’я" },
            { name: "Інше" },
          ],
        },
      },
      {
        name: "Креативність та дизайн",
        subCategories: {
          create: [
            { name: "Графічний дизайн" },
            { name: "UI/UX-дизайн" },
            { name: "Музика та звукозапис" },
            { name: "Фото- та відеомистецтво" },
            { name: "Інше" },
          ],
        },
      },
      {
        name: "Бізнес та підприємництво",
        subCategories: {
          create: [
            { name: "Маркетинг і реклама" },
            { name: "Фінансова грамотність" },
            { name: "Управління проєктами" },
            { name: "Створення стартапів" },
            { name: "Інше" },
          ],
        },
      },
      {
        name: "Технології та програмування",
        subCategories: {
          create: [
            { name: "Веброзробка (HTML, CSS, JavaScript, фреймворки)" },
            { name: "Мобільна розробка (iOS, Android, Flutter)" },
            { name: "Штучний інтелект та машинне навчання" },
            { name: "Бази даних та DevOps" },
            { name: "Інше" },
          ],
        },
      },
      {
        name: "Освіта та наука",
        subCategories: {
          create: [
            { name: "Математика" },
            { name: "Природничі науки (фізика, біологія, хімія)" },
            { name: "Гуманітарні науки (історія, філософія, література)" },
            { name: "Іноземні мови" },
            { name: "Інше" },
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