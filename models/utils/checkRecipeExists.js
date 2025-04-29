const db= require("../../db/connection");

const checkRecipeExists = (recipe_id) => {
    return db.query("SELECT * FROM recipes WHERE recipes.recipe_id = $1", [recipe_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Recipe does not exist." });
        }
        return rows;
    });
}

module.exports = checkRecipeExists;