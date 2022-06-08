const express = require("express");
const cors = require("cors");
const app = express();
const videosRoutes = require("./routes/videos");
require("dotenv").config();

//get PORT variable from .env file
const { PORT } = process.env;

//Run Cors
app.use(cors());

//Parse request body
app.use(express.json());

//Set up static folder
app.use(express.static("images"));

//Set up video routes
app.use("/videos", videosRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
