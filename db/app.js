const express = require("express");
const getEndpoints = require("../controllers/getEndpoints");
const getRecipes = require("../controllers/getRecipes");
const app = express();

app.use("/api/recipes", getRecipes)

app.use("/api", getEndpoints);

module.exports = app;