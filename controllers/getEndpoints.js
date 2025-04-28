const endpoints = require("../endpoints.json");

const getEndpoints = (request, response) => {
    response.status(200).send({ endpoints });
}

module.exports = getEndpoints;