const selectTags = require("../models/selectTags")

const getTags = (request, response, next) => {
    selectTags()
    .then((tags) => {
        response.status(200).send({ tags });
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = getTags;