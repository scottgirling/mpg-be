const selectRecipeById = require("../models/selectRecipeById");

const getRecipeById = (request, response, next) => {
    const { recipe_id } = request.params;
    selectRecipeById(recipe_id)
    .then((recipe) => {
        response.status(200).send({ recipe });
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = getRecipeById;