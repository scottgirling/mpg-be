const format = require("pg-format");
const db = require("../connection");

const seed = ({ tagData, userData, recipeData }) => {
    return db.query(`DROP TABLE IF EXISTS recipes;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS tags;`);
    })
    .then(() => {
        const tagsTablePromise = db.query(`
            CREATE TABLE tags (
            slug VARCHAR PRIMARY KEY
        );`)

        const usersTablePromise = db.query(`
            CREATE TABLE users (
            username VARCHAR PRIMARY KEY,
            name VARCHAR NOT NULL,
            avatar_url VARCHAR,
            meal_plans TEXT[][],
            favourite_meals TEXT[]
        );`)

        return Promise.all([tagsTablePromise, usersTablePromise]);
    })
    .then(() => {
        return db.query(`CREATE TABLE recipes (
            recipe_id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            ingredients TEXT[] NOT NULL,
            instructions TEXT[] NOT NULL,
            prep_time VARCHAR NOT NULL,
            cook_time VARCHAR NOT NULL,
            votes INT DEFAULT 0 NOT NULL,
            servings INT NOT NULL,
            tags TEXT[],
            created_by VARCHAR REFERENCES users(username) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            recipe_img_url VARCHAR,
            difficulty INT NOT NULL
            );`)
    })
    .then(() => {
        const insertTagsQueryStr = format(
            `INSERT INTO tags (slug) VALUES %L;`, tagData.map(({ slug }) => [slug])
        );
        // const tagsPromise = db.query(insertTagsQueryStr);

        return db.query(insertTagsQueryStr);


        // const insertUsersQueryStr = format(
        //     `INSERT INTO users (username, name, avatar_url, meal_plans, favourite_meals) VALUES %L;`, userData.map(({ username, name, avatar_url, meal_plans, favourite_meals}) => [username, name, avatar_url, meal_plans, favourite_meals])
        // );
        // const usersPromise = db.query(insertUsersQueryStr);

        // return Promise.all([tagsPromise, usersPromise]);
    })
    .then(() => {
        const insertUsersQueryStr = format(
            `INSERT INTO users (username, name, avatar_url, meal_plans, favourite_meals) VALUES %L;`, 
            userData.map(({ username, name, avatar_url, meal_plans, favourite_meals }) => [username, name, avatar_url, (`{${meal_plans}}`), (`{${favourite_meals}}`)])
        );
        return db.query(insertUsersQueryStr);
    })
    .then(() => {
        const insertRecipeQueryStr = format(
            `INSERT INTO recipes (name, ingredients, instructions, prep_time, cook_time, votes, servings, tags, created_by, created_at, recipe_img_url, difficulty) VALUES %L RETURNING *;`, 
            recipeData.map(({ name, ingredients, instructions, prep_time, cook_time, votes = 0, servings, tags, created_by, created_at, recipe_img_url, difficulty }) => [
                name,
                (`{${ingredients}}`),
                (`{${instructions}}`),
                prep_time,
                cook_time,
                votes,
                servings,
                (`{${tags}}`),
                created_by,
                created_at,
                recipe_img_url,
                difficulty
            ])
        );
        return db.query(insertRecipeQueryStr);
    })
}

module.exports = seed;