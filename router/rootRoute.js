const express = require("express");
const authRoutes = require("./authRoutes");
const entriesRoutes = require("./entriesRoutes");
const rootRouter = express.Router();



rootRouter.use("/auth", authRoutes);
rootRouter.use("/entries", entriesRoutes);

module.exports = rootRouter;
