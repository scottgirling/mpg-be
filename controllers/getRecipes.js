const selectRecipes = require("../models/selectRecipes");
const checkTagExists = require("../models/utils/checkTagsExist");

const getRecipes = (request, response, next) => {
    const { sort_by, order, tags } = request.query;
    if (tags) {
        checkTagExists(tags)
        .then(() => {
            return selectRecipes(sort_by, order, tags)
        })
        .then((recipes) => {
            response.status(200).send({ recipes });
        })
        .catch((error) => {
            next(error);
        });
    } else {
        selectRecipes(sort_by, order, tags)
        .then((recipes) => {
            response.status(200).send({ recipes });
        })
        .catch((error) => {
            next(error);
        });
    }

}

module.exports = getRecipes;