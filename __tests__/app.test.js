const request = require("supertest");
const app = require("../db/app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpointsJson = require("../endpoints.json");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return connection.end();
});

describe("GET /api", () => {
    test("200: responds with an object documenting each endpoint - including a description, example path and example response", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body: { endpoints } }) => {
            expect(endpoints).toEqual(endpointsJson);
        });
    });
});

describe("GET /api/recipes", () => {
    test("200: responds with an array of recipe objects, with the appropriate properties and status code", () => {
        return request(app)
        .get("/api/recipes")
        .expect(200)
        .then(({ body: { recipes } }) => {
            expect(recipes.length).toBe(12);
            recipes.forEach((recipe) => {
                expect(recipe).toHaveProperty("recipe_id", expect.any(Number));
                expect(recipe).toHaveProperty("name", expect.any(String));
                expect(recipe).toHaveProperty("ingredients", expect.any(Array));
                expect(recipe).toHaveProperty("instructions", expect.any(Array));
                expect(recipe).toHaveProperty("prep_time", expect.any(String));
                expect(recipe).toHaveProperty("cook_time", expect.any(String));
                expect(recipe).toHaveProperty("votes", expect.any(Number));
                expect(recipe).toHaveProperty("servings", expect.any(Number));
                expect(recipe).toHaveProperty("tags", expect.any(Array));
                expect(recipe).toHaveProperty("created_by", expect.any(String));
                expect(recipe).toHaveProperty("created_at", expect.any(String));
                expect(recipe).toHaveProperty("recipe_img_url", expect.any(String));
                expect(recipe).toHaveProperty("difficulty", expect.any(Number));
            });
        });
    });
});