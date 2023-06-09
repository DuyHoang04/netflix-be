const routes = require("express").Router();
const authRoute = require("./v1/authRoute.js");
const userRoute = require("./v1/userRoute.js");
const movieRoute = require("./v1/movieRoute.js");
const genresRoute = require("./v1/genresRoute.js");
const seriesRoute = require("./v1/seriesRoute.js");
const mediaRoute = require("./v1/mediaRoute.js");

routes.use("/api/v1/auth", authRoute);
routes.use("/api/v1/users", userRoute);
routes.use("/api/v1/movies", movieRoute);
routes.use("/api/v1/series", seriesRoute);
routes.use("/api/v1/genres", genresRoute);
routes.use("/api/v1/media", mediaRoute);

module.exports = routes;
