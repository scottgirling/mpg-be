const db = require("../db/connection");

const selectUserByUsername = (username) => {
    return db.query("SELECT * FROM users WHERE users.username = $1", [username])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "User does not exist." });
        }
        return rows[0];
    });
}

module.exports = selectUserByUsername;