// import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";
import { jest } from "@jest/globals";
// import { Recommendation } from "@prisma/client";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { createRecommendationFactory } from "../factories/createRecommendationsFactory.js";
import { recommendationService } from "../../src/services/recommendationsService.js";

/* eslint-disable no-undef */
beforeEach(async () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
});

describe("Recommendations Unit tests (Servuice)", () => {
  it("if score less than -5 should delete the recommendation", async () => {
    const recommendation =
      await createRecommendationFactory.createOneRecommendationWithScore(-6);
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce(null);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce(null);
    const recommendationRemove = jest.spyOn(recommendationRepository, "remove");
    await recommendationService.downvote(recommendation.id);
    expect(recommendationRemove).toBeCalledTimes(1);
  });
});
