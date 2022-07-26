import { prisma } from "./../src/database.js"
import supertest from "supertest";
import { createRecommendationFactory } from "./factories/createRecommendationsFactory.js";
import app from "./../src/app.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

describe("Tests tests", () => {

    it("Create Recommendation Success - name, youtubeLink correct insert exxpect 201", async () => {
        const recommendation = createRecommendationFactory.createRecommendation();
        const result = await supertest(app).post('/recommendations').send(recommendation);
        expect(result.status).toBe(201);
        const isRecommendationRegistered = await prisma.recommendation.findFirst({
            where: { name: recommendation.name },
        });
        expect(isRecommendationRegistered).not.toBeNull();
    })

    it("Create Recommendation Fail - body not send 422", async () => {
        const result = await supertest(app).post('/recommendations').send({});
        expect(result.status).toBe(422);
    })

})