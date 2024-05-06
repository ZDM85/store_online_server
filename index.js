require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const sequelize = require("./db");
const models = require("./models/model");
const errorHandler = require("./middleware/ErrorHandlerMiddleware");
const cors = require("cors");
const router = require("./routes/index");
const fileupload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    credentials: true,
    origin: process.env.API_URL,
  })
);
app.use(fileupload({}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "static")));
app.use("/api", router);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
