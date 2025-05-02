const db = require("../db/connection");

const removeRecipeById = (recipe_id) => {
    return db.query("DELETE FROM recipes WHERE recipes.recipe_id = $1 RETURNING *", [recipe_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Recipe does not exist." });
        }
    });
}

module.exports = removeRecipeById;