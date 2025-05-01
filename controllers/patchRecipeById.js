const updateRecipeById = require("../models/updateRecipeById");

const patchRecipeById = (request, response, next) => {
    const { recipe_id } = request.params;
    const { voteChange } = request.body;
    updateRecipeById(recipe_id, voteChange)
    .then((recipe) => {
        response.status(200).send({ recipe });
    })
    .catch((error) => {
        next(error)
    });
}

module.exports = patchRecipeById;