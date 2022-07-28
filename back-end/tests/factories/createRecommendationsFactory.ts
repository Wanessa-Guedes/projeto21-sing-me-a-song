import { prisma } from "../../src/database.js";
import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";
import { Recommendation } from "@prisma/client";

type CreateRecommendationWithScore = Omit<Recommendation, "id">;

function createRecommendation() {
  const recommendation: CreateRecommendationData = {
    name: faker.lorem.words(),
    youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
  };

  return recommendation;
}

async function createRecommendationsWithScore(qte: number) {
  const recommendations: CreateRecommendationWithScore[] = [];

  for (let i = 0; i < qte; i++) {
    const recommendation = {
      name: faker.lorem.words(i + 1),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
      score: i,
    };
    recommendations.push(recommendation);
  }

  await prisma.recommendation.createMany({
    data: recommendations,
  });

  const result = await prisma.recommendation.findMany({});

  return result;
}

export const createRecommendationFactory = {
  createRecommendation,
  createRecommendationsWithScore,
};
