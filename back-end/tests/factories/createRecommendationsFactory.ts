import {prisma} from "../../src/database.js";
import {faker} from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

function createRecommendation () {
    return {
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`
    }
}

async function createRecommendationWithScore(score: number){
    const recommendation = {
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`,
        score: score
    }

    await prisma.recommendation.create({
        data: recommendation
    })

    const result = await prisma.recommendation.findFirst({
        where: {
            name: recommendation.name
        }
    })

    return result
}

export const createRecommendationFactory =  {
    createRecommendation,
    createRecommendationWithScore
}
