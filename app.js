const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const movieRouter = require('./routes/movie');

const tokenVerify = require('./middleware/tokenVerify')

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({ secret: "i2u374y5340987", resave: false, saveUninitialized: true })
);
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/movie",tokenVerify, movieRouter);


module.exports = app;
