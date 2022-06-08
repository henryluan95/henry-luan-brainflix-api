const fs = require("fs");

//Create a function to read data
const readVideos = () => {
  return JSON.parse(fs.readFileSync("./data/videos.json"));
};

module.exports = readVideos;
