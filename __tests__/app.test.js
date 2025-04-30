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

describe("GET /api/recipes/:recipe_id", () => {
    test("200: responds with a single recipe object, with the appropriate properties and status code", () => {
        return request(app)
        .get("/api/recipes/1")
        .expect(200)
        .then(({ body: { recipe } }) => {
            const expectedOutput = {
                "name": "Spaghetti Carbonara",
                "ingredients": [
                  "200g spaghetti",
                  "100g pancetta",
                  "2 large eggs",
                  "50g pecorino cheese",
                  "2 cloves garlic",
                  "Salt",
                  "Black pepper"
                ],
                "instructions": [
                  "Boil spaghetti in salted water.",
                  "Fry pancetta and garlic until crispy.",
                  "Beat eggs with cheese^ salt and pepper.",
                  "Drain pasta and mix quickly with pancetta and egg mixture.",
                  "Serve hot."
                ],
                "prep_time": "10 mins",
                "cook_time": "20 mins",
                "votes": 0,
                "servings": 2,
                "tags": ["Italian", "Pasta", "Quick"],
                "created_by": "chef_anna",
                "created_at": "2025-04-23T14:00:00.000Z",
                "recipe_img_url": "https://example.com/images/spaghetti-carbonara.jpg",
                "difficulty": 2
            }
            expect(recipe).toMatchObject(expectedOutput);
        });
    });
    test("404: responds with an appropriate status code and error message when given a valid but non-existent id", () => {
        return request(app)
        .get("/api/recipes/99")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Recipe does not exist.");
        });
    });
    test("400: responds with an appropriate status code and error message when given an invalid id", () => {
        return request(app)
        .get("/api/recipes/seven")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid data type.")
        });
    });
});

describe("GET /api/users/:username", () => {
    test("200: responds with a single user object with the appropriate properties and status code", () => {
        return request(app)
        .get("/api/users/chef_anna")
        .expect(200)
        .then(({ body: { user } }) => {
        const expectedOutput = {
            "username": "chef_anna",
            "name": "Anna",
            "avatar_url": "https://picsum.photos/200?random=1",
            "meal_plans": [
                {
                    "2025-04-21": "7",
                    "2025-04-22": "3",
                    "2025-04-23": "1",
                    "2025-04-24": "8",
                    "2025-04-25": "10",
                    "2025-04-26": "9",
                    "2025-04-27": "4"
                },
                {
                    "2025-05-01": "12",
                    "2025-05-02": "5",
                    "2025-05-03": "11",
                    "2025-05-04": "2"
                }
            ],
            "favourite_meals": [
                "1",
                "10",
                "7"
            ]
        }
        expect(user).toMatchObject(expectedOutput);
        });
    });
    test("404: responds with an appropriate status code and error message when given a valid but non-existent username", () => {
        return request(app)
        .get("/api/users/scott")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("User does not exist.");
        });
    });
});