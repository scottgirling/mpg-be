const getRecipes = require("../../controllers/getRecipes");
const getRecipeById = require("../../controllers/getRecipeById");
const patchRecipeById = require("../../controllers/patchRecipeById");
const postRecipe = require("../../controllers/postRecipe");
const deleteRecipeById = require("../../controllers/deleteRecipeById");

const recipesRouter = require("express").Router();

recipesRouter
    .route("/")
    .get(getRecipes)
    .post(postRecipe);

recipesRouter
    .route("/:recipe_id")
    .get(getRecipeById)
    .patch(patchRecipeById)
    .delete(deleteRecipeById);

module.exports = recipesRouter;