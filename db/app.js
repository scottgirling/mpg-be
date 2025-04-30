const express = require("express");
const getEndpoints = require("../controllers/getEndpoints");
const getRecipes = require("../controllers/getRecipes");
const getRecipeById = require("../controllers/getRecipeById");
const getUserByUsername = require("../controllers/getUserByUsername");
const app = express();

app.use("/api/recipes/:recipe_id", getRecipeById);

app.use("/api/recipes", getRecipes);

app.use("/api/users/:username", getUserByUsername);

app.use("/api", getEndpoints);

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    }
    next(error);
});

app.use((error, request, response, next) => {
    if (error.code === "22P02") {
        response.status(400).send({ msg: "Invalid data type." });
    }
    next(error);
});

module.exports = app;