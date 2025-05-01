const db = require("../db/connection");

const selectRecipes = (sort_by = "created_at", order = "desc", tags, limit = 10, p = 1) => {
    const allowedSortBy = ["created_at", "votes", "difficulty", "prep_time", "cook_time"];
    const allowedOrderBy = ["asc", "desc"];
    const queryValues = [];

    if (!allowedSortBy.includes(sort_by) || !allowedOrderBy.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid 'Sort By' or 'Order'. Please select a valid input." });
    }

    let sqlStr = 'SELECT * FROM recipes';

    if (tags) {
        if (typeof tags === "string") {
            sqlStr += ' WHERE tags[1][2][3] = $1';
            queryValues.push(tags);
        } else if (tags.length > 1) {
            sqlStr += ' WHERE tags[1][2][3] = $1 OR tags[1][2][3] = $2 OR tags[1][2][3] = $3';
            tags.forEach((tag) => queryValues.push(tag));
        }
    }

    sqlStr += ` ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${(p - 1) * limit}`;
    
    return db.query(sqlStr, queryValues)
    .then(({ rows }) => {
        return rows;
    });
}

module.exports = selectRecipes;