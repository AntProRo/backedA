const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const app = express();
// Call all Routes
const routes = require("./Routes/routes");
const uploadRoute = require("./Routes/upload");

// Connect to MongoAtlas
const mongoose = require("mongoose");
mongoose.set("runValidators", true);
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected Successfully.");
  })
  .catch((err) => {
    console.log("Database connection failed.", err);
  });
mongoose.connection;
//get data from inputs of req.body
app.use(express.json());
//get body entries
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(cookieParser());
app.use("/api", routes.user);
app.use("/api", routes.admin);
app.use("/api", routes.apiCollaborator);
app.use("/api", routes.task);
app.use("/api", routes.project);
app.use("/api", routes.chat);
app.use("/api", routes.manager);
app.use("/api", uploadRoute);
/* app.use('/api',uploadRoute) */
// catch Error
app.use(function (err, res) {
  res.json({ error: err.message });
});
const PORT = process.env.PORT  || 5000;
app.listen(PORT, () => console.log("Server Activated Correctly"));
