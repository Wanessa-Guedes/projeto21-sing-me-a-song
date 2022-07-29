/* eslint-disable no-undef */
import { prisma } from "../../src/database.js";
import supertest from "supertest";
import { createRecommendationFactory } from "./../factories/createRecommendationsFactory.js";
import app from "../../src/app.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
});

describe("Recommendations tests", () => {
  it("Should Create Recommendation Success - name, youtubeLink correct insert expect 201", async () => {
    const recommendation =
      createRecommendationFactory.createRecommendationData();
    const result = await supertest(app)
      .post("/recommendations")
      .send(recommendation);
    expect(result.status).toBe(201);
    const isRecommendationRegistered = await prisma.recommendation.findFirst({
      where: { name: recommendation.name },
    });
    expect(isRecommendationRegistered).not.toBeNull();
  });

  it("Should Create Recommendation Fail - body not send expect 422", async () => {
    const result = await supertest(app).post("/recommendations").send({});
    expect(result.status).toBe(422);
  });

  it("Should Create Recommendation FAIL - Data already registered expect 409", async () => {
    const recommendation =
      createRecommendationFactory.createRecommendationData();
    const createRecommendationInDB =
      await createRecommendationFactory.createRecommendation(recommendation);

    const result = await supertest(app).post("/recommendations").send({
      name: createRecommendationInDB.name,
      youtubeLink: createRecommendationInDB.youtubeLink,
    });
    expect(result.status).toBe(409);
  });

  it("Should Create Recommendation FAIL - Invalid Link expect 422", async () => {
    const recommendation =
      createRecommendationFactory.createRecommendationData();
    const recommendationWrongLink = {
      ...recommendation,
      youtubeLink: `www.teste.com`,
    };

    const result = await supertest(app)
      .post("/recommendations")
      .send({ recommendationWrongLink });
    expect(result.status).toBe(422);
  });

  it("Should Add a pontuation on Recommendation Succes - expect 200", async () => {
    const recommendation =
      await createRecommendationFactory.createRecommendationsWithScore(1);
    const id = recommendation[0].id;
    const result = await supertest(app).post(`/recommendations/${id}/upvote`);
    expect(result.status).toBe(200);
    const response = await prisma.recommendation.findUnique({
      where: {
        id,
      },
    });
    expect(response.score).toBe(1);
  });

  it("Should Add a pontuation - FAIL (Invalid ID) - expect 404", async () => {
    const id = 100;
    const result = await supertest(app).post(`/recommendations/${id}/upvote`);
    expect(result.status).toBe(404);
  });

  it("Should Remove a pontuation on Recommendation Succes - expect 200", async () => {
    const recommendation =
      await createRecommendationFactory.createRecommendationsWithScore(1);
    const id = recommendation[0].id;
    const result = await supertest(app).post(`/recommendations/${id}/downvote`);
    expect(result.status).toBe(200);
    const response = await prisma.recommendation.findUnique({
      where: {
        id,
      },
    });
    expect(response.score).toBe(-1);
  });

  it("Should Remove a pontuation and deleted because is less than -5 on Recommendation Succes - expect 200", async () => {
    const recommendation =
      await createRecommendationFactory.createOneRecommendationWithScore(-5);
    const id = recommendation.id;
    const result = await supertest(app).post(`/recommendations/${id}/downvote`);
    expect(result.status).toBe(200);
    const response = await prisma.recommendation.findUnique({
      where: {
        id,
      },
    });
    expect(response).toBeNull();
  });

  it("Should Remove a pontuation - FAIL (Invalid ID) - expect 404", async () => {
    const id = 100;
    const result = await supertest(app).post(`/recommendations/${id}/downvote`);
    expect(result.status).toBe(404);
  });

  it("Should GET top 10 recommendations if there is more than 10 registered - Success - expect 200", async () => {
    await createRecommendationFactory.createRecommendationsWithScore(11);
    const result = await supertest(app).get(`/recommendations`);
    expect(result.status).toBe(200);
    expect(result.body.length).toBeLessThan(11);
  });

  it("Should GET recommendations - Success - expect 200", async () => {
    await createRecommendationFactory.createRecommendationsWithScore(3);
    const result = await supertest(app).get(`/recommendations`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(3);
  });

  it("Should GET recommendations by ID - Success - expect 200", async () => {
    const recommendation =
      await createRecommendationFactory.createRecommendationsWithScore(1);
    const id = recommendation[0].id;
    const result = await supertest(app).get(`/recommendations/${id}`);
    expect(result.status).toBe(200);
    expect(result.body.id).toEqual(id);
  });

  it("Should GET recommendations by ID - FAIL (Invalid ID) - expect 404", async () => {
    const id = 100;
    const result = await supertest(app).get(`/recommendations/${id}`);
    expect(result.status).toBe(404);
  });

  it("Should GET recommendations TOP Amount - Success - expect 200", async () => {
    const recommendation =
      await createRecommendationFactory.createRecommendationsWithScore(10);
    const amount = recommendation.length;
    const result = await supertest(app).get(`/recommendations/top/${amount}`);
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(10);
  });
  // TODO: RECOMMENDATIONS RANDOM
  it("Should GET a random recommendation - Success - expect 200", async () => {
    await createRecommendationFactory.createRecommendationsWithScore(5);
    const result = await supertest(app).get(`/recommendations/random`);
    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
