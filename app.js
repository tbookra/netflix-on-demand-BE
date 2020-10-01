const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MONGO");
});
mongoose.connection.on("error", (err) => {
  console.log("error connecting to MONGO", err);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({ secret: "i2u374y5340987", resave: false, saveUninitialized: true })
);
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
