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
            expect(Array.isArray(recipes)).toBe(true);
            recipes.forEach((recipe) => {
                expect(recipe).toHaveProperty("recipe_id", expect.any(Number));
                expect(recipe).toHaveProperty("name", expect.any(String));
                expect(recipe).toHaveProperty("ingredients", expect.any(Array));
                expect(recipe).toHaveProperty("instructions", expect.any(Array));
                expect(recipe).toHaveProperty("prep_time", expect.any(Number));
                expect(recipe).toHaveProperty("cook_time", expect.any(Number));
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
    describe("GET /api/recipes QUERIES", () => {
        describe("sort_by", () => {
            test("200: responds with an ordered array of recipe objects sorted by a valid column with an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?sort_by=cook_time")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes).toBeSortedBy("cook_time", { descending: true });
                });
            });
            test("200: responds with an ordered array of recipe objects sorted by a default column ('created_at') when one is not specifically selected, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes).toBeSortedBy("created_at", { descending: true });
                });
            });
            test("400: responds with an appropriate status code and error message when sorted by a non-existent column", () => {
                return request(app)
                .get("/api/recipes?sort_by=total_time")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Invalid 'Sort By' or 'Order'. Please select a valid input.");
                });
            });
        });
        describe("order", () => {
            test("200: responds with an ordered array of recipe objects given the 'order' query, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?order=asc")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes).toBeSortedBy("created_at", { descending: false });
                });
            });
            test("200: responds with an ordered array of recipe objects in the default order ('desc') when one is not specifically selected, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?sort_by=prep_time")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes).toBeSortedBy("prep_time", { descending: true });
                });
            });
            test("400: responds with an appropriate status code and error message when ordered by a non-existent 'order' query", () => {
                return request(app)
                .get("/api/recipes?order=newest")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Invalid 'Sort By' or 'Order'. Please select a valid input.");
                });
            });
        });
        describe("tags", () => {
            test("200: responds with a filtered array of recipe objects when a single 'tag' is provided, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?tags=quick")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    recipes.forEach((recipe) => {
                        expect(recipe.tags.includes("quick")).toBe(true);
                    });
                });
            });
            test("200: responds with an empty array and an appropriate status code when valid tag(s) are provided but no recipes currently exist on it", () => {
                return request(app)
                .get("/api/recipes?tags=mexican")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes.length).toBe(0);
                });
            });
            test("400: responds with an appropriate status code and error message when more than one 'tag' is selected at a given time", () => {
                return request(app)
                .get("/api/recipes?tags=quick&tags=dinner&tags=comfort-food")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Invalid request - select a single tag.");
                });
            });
            test("404: responds with an appropriate status code and error message when filtering by a 'tag' that does not yet exist", () => {
                return request(app)
                .get("/api/recipes?tags=chinese")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Category does not exist. Please try another.");
                });
            });
        });
        describe("pagination", () => {
            test("200: responds with an array of recipe objects according to the given 'limit' query, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?limit=5")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes.length).toBe(5);
                });
            });
            test("200: responds with an array of recipe objects according to the default 'limit' (10) when not otherwise specified, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes.length).toBe(10);
                });
            });
            test("400: responds with an appropriate status code and error message when provided with an invalid 'limit' query", () => {
                return request(app)
                .get("/api/recipes?limit=ten")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Invalid data type.");
                });
            });
            test("200: responds with an array of recipe objects according to the given 'p' query (which specifies the page to display data for), as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes?limit=5&p=3")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes.length).toBe(2);
                });
            });
            test("200: responds with an array of recipe objects according to the deafult 'p' query (1) when not otherwise specified, as well as an appropriate status code", () => {
                return request(app)
                .get("/api/recipes")
                .expect(200)
                .then(({ body: { recipes } }) => {
                    expect(recipes.length).toBe(10);
                });
            });
            test("400: responds with an appropriate status code and error message when provided with an invalid 'p' query", () => {
                return request(app)
                .get("/api/recipes?p=one")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Invalid data type.");
                });
            });
            test("404: responds with an appropriate status code and error message when provided with a valid but non-existent 'p' query", () => {
                return request(app)
                .get("/api/recipes?limit=5&p=35")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Page does not exist.");
                });
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
                "prep_time": 10,
                "cook_time": 20,
                "votes": 0,
                "servings": 2,
                "tags": ["italian", "pasta", "quick"],
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
                { "2025-04-21": "7" },
                { "2025-04-22": "3" },
                { "2025-04-23": "1" },
                { "2025-04-24": "8" },
                { "2025-04-25": "10" },
                { "2025-04-26": "9" },
                { "2025-04-27": "4" },
                { "2025-05-01": "12" },
                { "2025-05-02": "5" },
                { "2025-05-03": "11" },
                { "2025-05-04": "2" }
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

describe("GET /api/tags", () => {
    test("200: responds with an array of tag objects, with the appropriate property and status code", () => {
        return request(app)
        .get("/api/tags")
        .expect(200)
        .then(({ body: { tags } }) => {
            expect(Array.isArray(tags)).toBe(true);
            expect(tags.length).toBe(24);
            tags.forEach((tag) => {
                expect(tag).toHaveProperty("slug", expect.any(String));
            });
        });
    });
});

describe("PATCH /api/recipes/:recipe_id", () => {
    test("200: responds with an updated recipe object when the 'votes' column has been incremented, as well as an appropriate status code", () => {
        return request(app)
        .patch("/api/recipes/1")
        .send({ voteChange: 1 })
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
                "prep_time": 10,
                "cook_time": 20,
                "votes": 1,
                "servings": 2,
                "tags": ["italian", "pasta", "quick"],
                "created_by": "chef_anna",
                "created_at": "2025-04-23T14:00:00.000Z",
                "recipe_img_url": "https://example.com/images/spaghetti-carbonara.jpg",
                "difficulty": 2
            }
            expect(recipe.votes).toBe(1);
            expect(recipe).toMatchObject(expectedOutput);
        });
    });
    test("200: responds with an updated recipe object when the 'votes' column has been decremented, as well as an appropriate status code", () => {
        return request(app)
        .patch("/api/recipes/1")
        .send({ voteChange: -1 })
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
                "prep_time": 10,
                "cook_time": 20,
                "votes": -1,
                "servings": 2,
                "tags": ["italian", "pasta", "quick"],
                "created_by": "chef_anna",
                "created_at": "2025-04-23T14:00:00.000Z",
                "recipe_img_url": "https://example.com/images/spaghetti-carbonara.jpg",
                "difficulty": 2
            }
            expect(recipe.votes).toBe(-1);
            expect(recipe).toMatchObject(expectedOutput);
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .patch("/api/recipes/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
    test("400: responds with an appropriate status code and error message when the request body contains an invalid 'voteChange' value", () => {
        return request(app)
        .patch("/api/recipes/1")
        .send({ voteChange: "one" })
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("400: responds with an appropriate status code and error message when given an invalid 'recipe_id'", () => {
        return request(app)
        .patch("/api/recipes/one")
        .send({ voteChange: 1} )
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("404: responds with an appropriate status code and error message when given a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .patch("/api/recipes/57")
        .send({ voteChange: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Recipe does not exist.");
        });
    });
});

describe("PATCH /api/users/:username", () => {
    describe("updating 'favourite_meals", () => {
        test("200: responds with an updated user object when the 'favourite_meals' column has been added to, as well as an appropriate status code", () => {
            return request(app)
            .patch("/api/users/chef_anna")
            .send({ favouriteMealChange: 2 })
            .expect(200)
            .then(({ body: { user } }) => {
                const expectedOutput = {
                    "username": "chef_anna",
                    "name": "Anna",
                    "avatar_url": "https://picsum.photos/200?random=1",
                    "meal_plans": [
                        { "2025-04-21": "7" },
                        { "2025-04-22": "3" },
                        { "2025-04-23": "1" },
                        { "2025-04-24": "8" },
                        { "2025-04-25": "10" },
                        { "2025-04-26": "9" },
                        { "2025-04-27": "4" },
                        { "2025-05-01": "12" },
                        { "2025-05-02": "5" },
                        { "2025-05-03": "11" },
                        { "2025-05-04": "2" }
                    ],
                    "favourite_meals": [
                        "1",
                        "10",
                        "7",
                        "2"
                    ]
                };
                expect(user.favourite_meals.length).toBe(4);
                expect(user).toMatchObject(expectedOutput);
            });
        });
        test("200: responds with an updated user object when an item has been removed from the the 'favourite_meals' column, as well as an appropriate status code", () => {
            return request(app)
            .patch("/api/users/chef_anna")
            .send({ favouriteMealChange: 1 })
            .expect(200)
            .then(({ body: { user } }) => {
                const expectedOutput = {
                    "username": "chef_anna",
                    "name": "Anna",
                    "avatar_url": "https://picsum.photos/200?random=1",
                    "meal_plans": [
                        { "2025-04-21": "7" },
                        { "2025-04-22": "3" },
                        { "2025-04-23": "1" },
                        { "2025-04-24": "8" },
                        { "2025-04-25": "10" },
                        { "2025-04-26": "9" },
                        { "2025-04-27": "4" },
                        { "2025-05-01": "12" },
                        { "2025-05-02": "5" },
                        { "2025-05-03": "11" },
                        { "2025-05-04": "2" }
                    ],
                    "favourite_meals": [
                        "10",
                        "7"
                    ]
                };
                expect(user.favourite_meals.length).toBe(2);
                expect(user).toMatchObject(expectedOutput);
            });
        });
        test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
            return request(app)
            .patch("/api/users/chef_anna")
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid request - missing field(s).");
            });
        });
        test("400: responds with an appropriate status code and error message when the request body contains an invalid 'favouriteMealChange' value", () => {
            return request(app)
            .patch("/api/users/chef_anna")
            .send({ favouriteMealChange: "two" })
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid data type.");
            });
        });
        test("404: responds with an appropriate status code and error message when given a valid but non-existent 'username'", () => {
            return request(app)
            .patch("/api/users/chef_scott")
            .send({ favouriteMealChange: 8 })
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("User does not exist.");
            });
        });
    });
    describe("updating meal_plans", () => {
        test("200: responds with an updated user object when the 'meal_plans' column has been added to, as well as an appropriate status code", () => {
            return request(app)
            .patch("/api/users/chef_anna")
            .send({ mealPlanChange: [
                { "2025-05-07": "1" },
                { "2025-05-08": "2" },
                { "2025-05-09": "3" },
                { "2025-05-10": "4" },
            ]
			})
            .expect(200)
            .then(({ body: { user } }) => {
                const expectedOutput = {
                    "username": "chef_anna",
                    "name": "Anna",
                    "avatar_url": "https://picsum.photos/200?random=1",
                    "meal_plans": [
                        { "2025-04-21": "7" },
                        { "2025-04-22": "3" },
                        { "2025-04-23": "1" },
                        { "2025-04-24": "8" },
                        { "2025-04-25": "10" },
                        { "2025-04-26": "9" },
                        { "2025-04-27": "4" },
                        { "2025-05-01": "12" },
                        { "2025-05-02": "5" },
                        { "2025-05-03": "11" },
                        { "2025-05-04": "2" },
                        { "2025-05-07": "1" },
                        { "2025-05-08": "2" },
                        { "2025-05-09": "3" },
                        { "2025-05-10": "4" }
                    ],
                    "favourite_meals": [
                        "1",
                        "10",
                        "7"
                    ]
                };
                expect(user.meal_plans.length).toBe(15);
                expect(user).toMatchObject(expectedOutput);
            });
        });
        test("200: responds with an updated user object when an item has been removed from the 'meal_plans' column, as well as an appropriate status code", () => {
            return request(app)
            .patch("/api/users/chef_anna")
            .send({ mealPlanChange: 
                { "2025-05-01": "12" }
            })
            .expect(200)
            .then(({ body: { user } }) => {
                const expectedOutput = {
                    "username": "chef_anna",
                    "name": "Anna",
                    "avatar_url": "https://picsum.photos/200?random=1",
                    "meal_plans": [
                        { "2025-04-21": "7" },
                        { "2025-04-22": "3" },
                        { "2025-04-23": "1" },
                        { "2025-04-24": "8" },
                        { "2025-04-25": "10" },
                        { "2025-04-26": "9" },
                        { "2025-04-27": "4" },
                        { "2025-05-02": "5" },
                        { "2025-05-03": "11" },
                        { "2025-05-04": "2" }
                    ],
                    "favourite_meals": [
                        "1",
                        "10",
                        "7"
                    ]
                };
                expect(user.meal_plans.length).toBe(10);
                expect(user).toMatchObject(expectedOutput);
            })
        });
        test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
            return request(app)
            .patch("/api/users/chef_anna")
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid request - missing field(s).");
            });
        });
        test("400: responds with an appropriate status code and error message when the request body contains an invalid 'mealPlanChange' value", () => {
            return request(app)
            .patch("/api/users/chef_anna")
            .send({ mealPlanChange: 
                "12"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid data type.");
            });
        });
        test("404: responds with an appropriate status code and error message when given a valid but non-existent username", () => {
            return request(app)
            .patch("/api/users/chef_scott")
            .send({ mealPlanChange:
                { "2025-05-01": "12" }
            })
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("User does not exist.");
            });
        });
    });
});

describe("DELETE /api/recipes/:recipe_id", () => {
    test("204: removes the recipe object of the given 'recipe_id' and returns the appropriate status code", () => {
        return request(app)
        .delete("/api/recipes/1")
        .expect(204)
    });
    test("400: responds with an appropriate status code and error message when given an invalid 'recipe_id'", () => {
        return request(app)
        .delete("/api/recipes/one")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid data type.");
        });
    });
    test("404: responds with an appropriate status code and error message when given a valid but non-existent 'recipe_id'", () => {
        return request(app)
        .delete("/api/recipes/55")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Recipe does not exist.");
        });
    });
});

describe("POST /api/recipes", () => {
    test("201: responds with the newly created recipe object and returns the appropriate status code", () => {
        return request(app)
        .post("/api/recipes")
        .send({
            "name": "Thai Green Curry",
            "ingredients": [
                "400ml coconut milk",
                "2 tbsp green curry paste",
                "300g chicken breast, sliced",
                "1 green bell pepper, sliced",
                "1 zucchini, sliced",
                "100g bamboo shoots",
                "1 tbsp fish sauce",
                "1 tsp brown sugar",
                "Fresh basil leaves",
                "Jasmine rice (to serve)"
            ],
            "instructions": [
                "Heat a wok over medium heat and add a bit of coconut milk.",
                "Stir in green curry paste and cook for 2 minutes until fragrant.",
                "Add chicken and cook until browned.",
                "Pour in the rest of the coconut milk and bring to a simmer.",
                "Add bell pepper, zucchini, and bamboo shoots; cook until tender.",
                "Season with fish sauce and brown sugar.",
                "Stir in fresh basil before serving.",
                "Serve hot with jasmine rice."
            ],
            "prep_time": 15,
            "cook_time": 20,
            "servings": 3,
            "tags": ["thai", "curry", "spicy"],
            "created_by": "chef_anna",
            "recipe_img_url": "https://example.com/images/thai-green-curry.jpg",
            "difficulty": 3
        })
        .expect(201)
        .then(({ body: { recipe } }) => {
            expect(recipe).toHaveProperty("recipe_id", expect.any(Number));
            expect(recipe).toHaveProperty("name", expect.any(String));
            expect(recipe).toHaveProperty("ingredients", expect.any(Array));
            expect(recipe).toHaveProperty("instructions", expect.any(Array));
            expect(recipe).toHaveProperty("prep_time", expect.any(Number));
            expect(recipe).toHaveProperty("cook_time", expect.any(Number));
            expect(recipe).toHaveProperty("votes", expect.any(Number));
            expect(recipe).toHaveProperty("servings", expect.any(Number));
            expect(recipe).toHaveProperty("tags", expect.any(Array));
            expect(recipe).toHaveProperty("created_by", expect.any(String));
            expect(recipe).toHaveProperty("created_at", expect.any(String));
            expect(recipe).toHaveProperty("recipe_img_url", expect.any(String));
            expect(recipe).toHaveProperty("difficulty", expect.any(Number));
        });
    });
    test("201: responds with the newly created recipe object when the 'recipe_img_url' column has been omitted from the request body, as well as an appropriate status code", () => {
        return request(app)
        .post("/api/recipes")
        .send({
            "name": "Thai Green Curry",
            "ingredients": [
                "400ml coconut milk",
                "2 tbsp green curry paste",
                "300g chicken breast, sliced",
                "1 green bell pepper, sliced",
                "1 zucchini, sliced",
                "100g bamboo shoots",
                "1 tbsp fish sauce",
                "1 tsp brown sugar",
                "Fresh basil leaves",
                "Jasmine rice (to serve)"
            ],
            "instructions": [
                "Heat a wok over medium heat and add a bit of coconut milk.",
                "Stir in green curry paste and cook for 2 minutes until fragrant.",
                "Add chicken and cook until browned.",
                "Pour in the rest of the coconut milk and bring to a simmer.",
                "Add bell pepper, zucchini, and bamboo shoots; cook until tender.",
                "Season with fish sauce and brown sugar.",
                "Stir in fresh basil before serving.",
                "Serve hot with jasmine rice."
            ],
            "prep_time": 15,
            "cook_time": 20,
            "servings": 3,
            "tags": [],
            "created_by": "chef_anna",
            "difficulty": 3
        })
        .expect(201)
        .then(({ body: { recipe } }) => {
            expect(recipe.recipe_img_url).toBeNull();
        });
    });
    test("400: responds with an appropriate status code and error message when the request body does not contain the correct fields", () => {
        return request(app)
        .post("/api/recipes")
        .send({
            "name": "Thai Green Curry",
            "ingredients": [
                "400ml coconut milk",
                "2 tbsp green curry paste",
                "300g chicken breast, sliced",
                "1 green bell pepper, sliced",
                "1 zucchini, sliced",
                "100g bamboo shoots",
                "1 tbsp fish sauce",
                "1 tsp brown sugar",
                "Fresh basil leaves",
                "Jasmine rice (to serve)"
            ],
            "instructions": [
                "Heat a wok over medium heat and add a bit of coconut milk.",
                "Stir in green curry paste and cook for 2 minutes until fragrant.",
                "Add chicken and cook until browned.",
                "Pour in the rest of the coconut milk and bring to a simmer.",
                "Add bell pepper, zucchini, and bamboo shoots; cook until tender.",
                "Season with fish sauce and brown sugar.",
                "Stir in fresh basil before serving.",
                "Serve hot with jasmine rice."
            ]
        })
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid request - missing field(s).");
        });
    });
});