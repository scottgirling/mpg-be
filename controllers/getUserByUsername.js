const selectUserByUsername = require("../models/selectUserByUsername");

const getUserByUsername = (request, response, next) => {
    const { username } = request.params;
    selectUserByUsername(username)
    .then((user) => {
        response.status(200).send({ user });
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = getUserByUsername;