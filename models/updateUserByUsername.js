const db = require("../db/connection");
const checkIfAlreadyFavourite = require("./utils/checkIfAlreadyFavourite");

const updateUserByUsername = (favouriteMealChange, mealPlanChange, username) => {
    return checkIfAlreadyFavourite(favouriteMealChange, mealPlanChange, username)
    .then(({ isAlreadyInArray, indexOfDuplicate }) => {
        if (favouriteMealChange) {
            if (!isAlreadyInArray) {
                return db.query(`UPDATE users SET favourite_meals = ARRAY_APPEND(favourite_meals, $1) WHERE users.username = $2 RETURNING *`, [(`${(favouriteMealChange)}`), username])
            } else {
                return db.query(`UPDATE users SET favourite_meals = ARRAY_REMOVE(favourite_meals, $1) WHERE users.username = $2 RETURNING *`, [favouriteMealChange, username])
            }
        }

        if (mealPlanChange) {
            if (!isAlreadyInArray) {
                return db.query(`UPDATE users SET meal_plans = meal_plans || '${JSON.stringify(mealPlanChange)}' ::jsonb WHERE users.username = $1 RETURNING *`, [username])
            } else {
                return db.query(`UPDATE users SET meal_plans = meal_plans - ${indexOfDuplicate} WHERE users.username = $1 RETURNING *`, [username])
            }
        }
    })
    .then(({ rows }) => {
        return rows[0];
    });
}

module.exports = updateUserByUsername;