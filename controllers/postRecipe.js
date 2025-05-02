const addRecipe = require("../models/addRecipe");

const postRecipe = (request, response, next) => {
    const { name, ingredients, instructions, prep_time, cook_time, servings, tags, created_by, recipe_img_url, difficulty } = request.body;

    addRecipe(name, ingredients, instructions, prep_time, cook_time, servings, tags, created_by, recipe_img_url, difficulty)
    .then((recipe) => {
        response.status(201).send({ recipe });
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = postRecipe;