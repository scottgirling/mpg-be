const db = require("../db/connection");

const selectTags = () => {
    return db.query("SELECT * FROM tags")
    .then(({ rows }) => {
        return rows;
    })
}

module.exports = selectTags;