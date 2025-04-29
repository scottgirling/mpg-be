const selectRecipes = require("../models/selectRecipes");

const getRecipes = (request, response, next) => {
    selectRecipes()
    .then((recipes) => {
        response.status(200).send({ recipes });
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = getRecipes;