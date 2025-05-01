const selectRecipes = require("../models/selectRecipes");
const checkTagExists = require("../models/utils/checkTagsExist");
const checkPageExists = require("../models/utils/checkPageExists");

const getRecipes = (request, response, next) => {
    const { sort_by, order, tags, limit, p } = request.query;
    if (tags) {
        checkTagExists(tags)
        .then(() => {
            checkPageExists(limit, p)
        })
        .then(() => {
            return selectRecipes(sort_by, order, tags, limit, p)
        })
        .then((recipes) => {
            response.status(200).send({ recipes });
        })
        .catch((error) => {
            next(error);
        });
    } else {
        checkPageExists(limit, p)
        .then(() => {
            return selectRecipes(sort_by, order, tags, limit, p)
        })
        .then((recipes) => {
            response.status(200).send({ recipes });
        })
        .catch((error) => {
            next(error);
        });
    }

}

module.exports = getRecipes;