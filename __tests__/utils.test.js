const formatRecipeInstructions = require("../db/seeds/utils");

describe("convertRecipeInstructions", () => {
    test("should return an object", () => {
        const testRecipe = {};
        const actualOutput = formatRecipeInstructions(testRecipe);
        expect(typeof actualOutput).toBe("object");
        expect(Array.isArray(actualOutput)).toBe(false);
        expect(actualOutput).not.toBeNull();
    });
    test("should replace all commas ',' within a string with a '^'", () => {
        const testRecipe = {
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
              "Beat eggs with cheese, salt and pepper.",
              "Drain pasta and mix quickly with pancetta and egg mixture.",
              "Serve hot."
            ],
            "prep_time": "10 mins",
            "cook_time": "20 mins",
            "votes": 0,
            "servings": 2,
            "tags": ["Italian", "Pasta", "Quick"],
            "created_by": "chef_anna",
            "created_at": "2025-04-23T14:00:00:00Z",
            "recipe_img_url": "https://example.com/images/spaghetti-carbonara.jpg",
            "difficulty": 2
        };
        const expectedInstructions = [
            "Boil spaghetti in salted water.",
            "Fry pancetta and garlic until crispy.",
            "Beat eggs with cheese^ salt and pepper.",
            "Drain pasta and mix quickly with pancetta and egg mixture.",
            "Serve hot."
        ];
        const actualOutput = formatRecipeInstructions(testRecipe);
        expect(actualOutput.instructions).toEqual(expectedInstructions);
    });
});