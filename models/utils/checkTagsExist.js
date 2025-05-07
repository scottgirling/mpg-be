const db = require("../../db/connection");

const checkTagExists = (tags) => {
    if (Array.isArray(tags)) {
        return Promise.reject({ status: 400, msg: "Invalid request - select a single tag." });
    }
    
    return db.query("SELECT * FROM tags WHERE tags.slug = $1", [tags])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Category does not exist. Please try another." });
        }
    });
}

module.exports = checkTagExists;