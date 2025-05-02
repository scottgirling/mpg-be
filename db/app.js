const express = require("express");
const getEndpoints = require("../controllers/getEndpoints");
const getRecipes = require("../controllers/getRecipes");
const getRecipeById = require("../controllers/getRecipeById");
const getUserByUsername = require("../controllers/getUserByUsername");
const patchRecipeById = require("../controllers/patchRecipeById");
const patchUserByUsername = require("../controllers/patchUserByUsername");
const deleteRecipeById = require("../controllers/deleteRecipeById");
const postRecipe = require("../controllers/postRecipe");
const app = express();

app.use(express.json());

app.get("/api/recipes/:recipe_id", getRecipeById);

app.get("/api/recipes", getRecipes);

app.get("/api/users/:username", getUserByUsername);

app.patch("/api/recipes/:recipe_id", patchRecipeById);

app.patch("/api/users/:username", patchUserByUsername);

app.delete("/api/recipes/:recipe_id", deleteRecipeById);

app.post("/api/recipes", postRecipe);

app.use("/api", getEndpoints);

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    }
    next(error);
});

app.use((error, request, response, next) => {
    if (error.code === "22P02" || error.code === "42703") {
        response.status(400).send({ msg: "Invalid data type." });
    }
    next(error);
});

app.use((error, request, response, next) => {
    if (error.code === "23502") {
        response.status(400).send({ msg: "Invalid request - missing field(s)." });
    }
    next(error);
})

module.exports = app;