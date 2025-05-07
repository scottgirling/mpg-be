const getEndpoints = require("../../controllers/getEndpoints");

const apiRouter = require("express").Router();
const recipesRouter = require("../routes/recipes-router");
const tagsRouter = require("../routes/tags-router");
const usersRouter = require("../routes/users-router");

apiRouter.use("/recipes", recipesRouter);
apiRouter.use("/tags", tagsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;