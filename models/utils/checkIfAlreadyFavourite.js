const db = require("../../db/connection");

const checkIfAlreadyFavourite = (username, favouriteMealChange) => {
    return db.query("SELECT favourite_meals FROM users WHERE users.username = $1", [username])
    .then(({ rows }) => {
        const favouriteMeals = rows[0].favourite_meals;
        const isAlreadyInArray = favouriteMeals.includes((favouriteMealChange.toString()));
        return isAlreadyInArray;
    })
    .catch(() => {
        return Promise.reject({ status: 404, msg: "User does not exist." });
    });
}

module.exports = checkIfAlreadyFavourite;