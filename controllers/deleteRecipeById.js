const removeRecipeById = require("../models/removeRecipeById");

const deleteRecipeById = (request, response, next) => {
    const { recipe_id } = request.params;
    removeRecipeById(recipe_id)
    .then((recipe) => {
        response.status(204).send({ recipe });
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = deleteRecipeById;