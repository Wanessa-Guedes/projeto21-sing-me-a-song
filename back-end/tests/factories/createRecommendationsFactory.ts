import {prisma} from "../../src/database.js";
import {faker} from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

function createRecommendation () {
    return {
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/${faker.random.alpha()}`
    }
}

export const createRecommendationFactory =  {
    createRecommendation
}
