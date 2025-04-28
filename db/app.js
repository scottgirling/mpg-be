const express = require("express");
const getEndpoints = require("../controllers/getEndpoints");
const app = express();

app.use("/api", getEndpoints);

module.exports = app;