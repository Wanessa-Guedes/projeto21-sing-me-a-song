import { prisma } from "../database.js";

async function reset() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
}

async function insertDatabaseForTests() {
  await prisma.recommendation.createMany({
    data: [
      {
        name: "Gilsons - Várias Queixas",
        youtubeLink: "https://www.youtube.com/watch?v=bBHPq3UQFsw",
      },
      {
        name: "Gilsons - Pra Gente Acordar",
        youtubeLink: "https://www.youtube.com/watch?v=qr96Vo6lEDg",
      },
      {
        name: "Gilsons, Mariana Volker - Devagarinho",
        youtubeLink: "https://www.youtube.com/watch?v=NPl2N9eQOn4",
      },
    ],
  });
}

export const e2eRepository = {
  reset,
  insertDatabaseForTests,
};
