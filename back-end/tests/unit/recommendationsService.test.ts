/* eslint-disable no-undef */
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

  it("Should delete the recommendation if score less than -5", async () => {
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

  it("Should Insert a recommendation", async () => {
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

  it("Should Insert a recommendation fails -  conflic (Recommendations names must be unique)", async () => {
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

  it("Should Upvote Success", async () => {
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

  it("Should Upvote - FAIL - Not a recommendation with this ID", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    await expect(recommendationService.upvote(1)).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });

  it("Should downvote Success", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
      score: 3,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce(recommendation);
    await recommendationService.downvote(recommendation.id);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledWith(
      recommendation.id,
      "decrement"
    );
  });

  it("Should downvote - FAIL - Not a recommendation with this ID", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    await expect(recommendationService.downvote(1)).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });

  it("Should get recommendations - Success", async () => {
    const recommendation: Recommendation[] = [
      {
        id: 1,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 1,
      },
    ];
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(recommendation);
    const result = await recommendationService.get();
    expect(result).toEqual(recommendation);
  });

  it("Should get top recommendations - Success", async () => {
    const recommendation: Recommendation[] = [
      {
        id: 1,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 1,
      },
    ];
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValueOnce(recommendation);
    const result = await recommendationService.getTop(10);
    expect(result).toEqual(recommendation);
  });

  it("get recommendation by id", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
      score: 1,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    const result = await recommendationService.getById(recommendation.id);
    expect(result).toEqual(recommendation);
  });

  it("get recommendation by id FAIL - Not found error", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
      score: 1,
    };
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    await expect(
      recommendationService.getById(recommendation.id)
    ).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });

  it("Should get random  - Songs with score bigger than 10 - Success", async () => {
    const recommendation: Recommendation[] = [
      {
        id: 1,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 1,
      },
      {
        id: 2,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 25,
      },
      {
        id: 3,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: -5,
      },
    ];
    jest.spyOn(Math, "random").mockReturnValue(0.8);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([recommendation[1]]);
    await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
    expect(recommendationRepository.findAll).toBeCalledWith({
      score: 10,
      scoreFilter: "lte",
    });
  });

  it("Should get random  - Songs with score lower than 10 and higher than -5 - Success", async () => {
    const recommendation: Recommendation[] = [
      {
        id: 1,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 1,
      },
      {
        id: 2,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 25,
      },
      {
        id: 3,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: -5,
      },
    ];
    jest.spyOn(Math, "random").mockReturnValue(0.3);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([recommendation[0], recommendation[2]]);
    await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
    expect(recommendationRepository.findAll).toBeCalledWith({
      score: 10,
      scoreFilter: "gt",
    });
  });

  it("Should get random all recommendations (ALL SCORES BIGGER THAN 10) - Success", async () => {
    const recommendation: Recommendation[] = [
      {
        id: 1,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 20,
      },
      {
        id: 2,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 25,
      },
      {
        id: 3,
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: 33,
      },
    ];
    jest.spyOn(Math, "random").mockReturnValue(0.3);
    jest.spyOn(Math, "floor").mockReturnValue(0.3);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(recommendation);
    await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalledTimes(2);
  });

  it("Should get error on random - FAIL - None recommendation", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.3);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
    await expect(recommendationService.getRandom()).rejects.toEqual({
      message: "",
      type: "not_found",
    });
    expect(recommendationRepository.findAll).toBeCalledTimes(2);
  });
});
