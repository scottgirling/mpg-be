const updateUserByUsername = require("../models/updateUserByUsername");

const patchUserByUsername = (request, response, next) => {
    const { username } = request.params;
    const { favouriteMealChange, mealPlanChange } = request.body;

    if (typeof favouriteMealChange === "number" || typeof mealPlanChange === "object") {
        updateUserByUsername(favouriteMealChange, mealPlanChange, username)
        .then((user) => {
            response.status(200).send({ user });
        })
        .catch((error) => {
            next(error);
        });
    } else if (typeof favouriteMealChange === "string" || typeof mealPlanChange === "number" || typeof mealPlanChange === "string") {
        return Promise.reject({ status: 400, msg: "Invalid data type." });
    } else {
        return Promise.reject({ status: 400, msg: "Invalid request - missing field(s)." });
    }
}

module.exports = patchUserByUsername;