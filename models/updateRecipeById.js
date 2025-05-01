const db = require("../db/connection");

const updateRecipeById = (recipe_id, voteChange) => {
    return db.query("UPDATE recipes SET votes = votes + $1 WHERE recipes.recipe_id = $2 RETURNING *", [voteChange, recipe_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Recipe does not exist." });
        }
        return rows[0];
    });

}

module.exports = updateRecipeById;