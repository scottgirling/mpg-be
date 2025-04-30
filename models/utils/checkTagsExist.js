const db = require("../../db/connection");

const checkTagExists = (tags) => {
    if (Array.isArray(tags)) {
        return db.query("SELECT * FROM tags WHERE tags.slug = $1 OR tags.slug = $2 OR tags.slug = $3", tags)
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Category does not exist. Please try another." });
            }
        });
    } else {
        return db.query("SELECT * FROM tags WHERE tags.slug = $1", [tags])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Category does not exist. Please try another." });
            }
        });
    }
}

module.exports = checkTagExists;