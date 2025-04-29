const selectRecipeById = require("../models/selectRecipeById");
const checkRecipeExists = require("../models/utils/checkRecipeExists");

const getRecipeById = (request, response, next) => {
    const { recipe_id } = request.params;
    checkRecipeExists(recipe_id)
    .then(() => {
        return selectRecipeById(recipe_id)
    })
    .then((recipe) => {
        response.status(200).send({ recipe });
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = getRecipeById;