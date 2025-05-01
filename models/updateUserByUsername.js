const db = require("../db/connection");
const checkIfAlreadyFavourite = require("./utils/checkIfAlreadyFavourite");

const updateUserByUsername = (username, favouriteMealChange) => {
    return checkIfAlreadyFavourite(username, favouriteMealChange)
    .then((isAlreadyInArray) => {
        if (!isAlreadyInArray) {
            return db.query("UPDATE users SET favourite_meals = ARRAY_APPEND(favourite_meals, $1) WHERE users.username = $2 RETURNING *", [favouriteMealChange, username])
        } else {
            return db.query("UPDATE users SET favourite_meals = ARRAY_REMOVE(favourite_meals, $1) WHERE users.username = $2 RETURNING *", [favouriteMealChange, username])
        }
    })
    .then(({ rows }) => {
        return rows[0];
    });
}

module.exports = updateUserByUsername;