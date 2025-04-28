const selectRecipes = require("../models/selectRecipes");

const getRecipes = (request, response) => {
    selectRecipes()
    .then((recipes) => {
        response.status(200).send({ recipes });
    });
}

module.exports = getRecipes;