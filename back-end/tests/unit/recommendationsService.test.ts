/* eslint-disable no-undef */
// /// <reference types="@types/jest" />

// import { faker } from "@faker-js/faker";
// import { prisma } from "../../src/database.js";
import { jest } from "@jest/globals";
import { Recommendation } from "@prisma/client";
import { faker } from "@faker-js/faker";
import {
  CreateRecommendationData,
  recommendationService,
} from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

describe("Recommendations Unit tests (Service)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("if score less than -5 should delete the recommendation", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
      score: -6,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce(recommendation);
    jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce(null);
    await recommendationService.downvote(recommendation.id);
    expect(recommendationRepository.remove).toBeCalledTimes(1);
    expect(recommendationRepository.remove).toBeCalledWith(recommendation.id);
  });

  it("Insert a recommendation", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
    };
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce(null);
    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalledTimes(1);
    expect(recommendationRepository.create).toBeCalledWith(recommendation);
  });
  // TODO: Entender pq deu certo...
  it("Insert a recommendation fails -  conflic (Recommendations names must be unique)", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
      score: 1,
    };
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(recommendation);
    await expect(recommendationService.insert(recommendation)).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
  });
  it("Upvote Success", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
      score: 1,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce(recommendation);
    await recommendationService.upvote(recommendation.id);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledWith(
      recommendation.id,
      "increment"
    );
  });
  it("get all recommendations - Success", async () => {});
});
