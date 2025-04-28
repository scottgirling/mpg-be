const db = require("../db/connection");

const selectRecipes = () => {
    return db.query("SELECT * FROM recipes;")
    .then(({ rows }) => {
        return rows;
    });
}

module.exports = selectRecipes;