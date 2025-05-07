const getTags = require("../../controllers/getTags");

const tagsRouter = require("express").Router();

tagsRouter
    .route("/")
    .get(getTags);

module.exports = tagsRouter;