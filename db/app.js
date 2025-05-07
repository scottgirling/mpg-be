const express = require("express");
const app = express();

const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);

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