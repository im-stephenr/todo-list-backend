const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./model/http-error");

const app = express();
app.use(bodyParser.json());

// Allows us to communicate between different domain
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * means allow any domain to access
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Routes
const userRoutes = require("./routes/users-routes");
const taskRoutes = require("./routes/task-routes");

// Routes to Controller
app.use("/api/users/", userRoutes);
app.use("/api/tasks/", taskRoutes);

app.get("/", function (req, res) {
  res.send("HELLO WORLD");
});

app.use((req, res, next) => {
  const error = new HttpError("Could not find route", 404);
  throw error;
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gudqyrg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    // connect port
    app.listen(3000, () => {
      console.log("Connected to port 3000");
    });
  })
  .catch((err) => {
    console.log("DB ERROR: ", err);
  });
