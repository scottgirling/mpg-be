const getUserByUsername = require("../../controllers/getUserByUsername");
const patchUserByUsername = require("../../controllers/patchUserByUsername");

const usersRouter = require("express").Router();

usersRouter
    .route("/:username")
    .get(getUserByUsername)
    .patch(patchUserByUsername);

module.exports = usersRouter;