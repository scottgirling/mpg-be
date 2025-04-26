const devData = require("../data/development-data/index");
const db = require("../connection");
const seed = require("./seed");

const runSeed = () => {
    return seed(devData).then(() => db.end());
}

runSeed();