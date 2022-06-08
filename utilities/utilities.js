const fs = require("fs");

//Create a function to read data
const readVideos = () => {
  return JSON.parse(fs.readFileSync("./data/videos.json"));
};

//Create a function to write data
const writeVideos = (videos) => {
  return fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
};

module.exports = { readVideos, writeVideos };
