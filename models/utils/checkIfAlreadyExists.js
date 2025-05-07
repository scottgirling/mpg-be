const db = require("../../db/connection");

const checkIfAlreadyExists = (favouriteMealChange, mealPlanChange, username) => {
    if (favouriteMealChange) {
        return db.query("SELECT favourite_meals FROM users WHERE users.username = $1", [username])
        .then(({ rows }) => {
            const favouriteMeals = rows[0].favourite_meals;
            const isAlreadyInArray = favouriteMeals.includes((favouriteMealChange.toString()));
            return { isAlreadyInArray };
        })
        .catch(() => {
            return Promise.reject({ status: 404, msg: "User does not exist." });
        });
    }

    if (mealPlanChange) {
        return db.query(`SELECT meal_plans FROM users WHERE users.username = $1`, [username])
        .then(({ rows }) => {
            const mealPlans = rows[0].meal_plans;

            let isAlreadyInArray = false;
            let duplicateDates = [];
            let indexOfDuplicate = 0;

            mealPlans.map((mealPlan) => {
                if (JSON.stringify(mealPlan) == JSON.stringify(mealPlanChange)) {
                    duplicateDates.push(mealPlanChange);
                    indexOfDuplicate = mealPlans.indexOf(mealPlan);
                }
            })
            
            if (duplicateDates.length) {
                isAlreadyInArray = true;
            }
            return { isAlreadyInArray, indexOfDuplicate }
        })
        .catch(() => {
            return Promise.reject({ status: 404, msg: "User does not exist." });
        });
    }
}

module.exports = checkIfAlreadyExists;