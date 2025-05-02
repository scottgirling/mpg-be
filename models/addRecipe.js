const db = require("../db/connection");

const addRecipe = (name, ingredients, instructions, prep_time, cook_time, servings, tags, created_by, recipe_img_url, difficulty) => {
    return db.query("INSERT INTO recipes (name, ingredients, instructions, prep_time, cook_time, servings, tags, created_by, recipe_img_url, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [name, ingredients, instructions, prep_time, cook_time, servings, tags, created_by, recipe_img_url, difficulty])
    .then(({ rows }) => {
        return rows[0];
    });
}

module.exports = addRecipe;