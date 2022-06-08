const express = require("express");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const router = express.Router();
const readVideos = require("../utilities/utilities");

//Set up a route for /videos endpoint -- get and post
router
  .route("/")
  //get method
  .get(function (_req, res) {
    //get data
    const videos = readVideos();
    //send back data
    return res.status(200).json(videos);
  })
  //post method
  .post(function (req, res) {
    //get existing data
    const videos = readVideos();
    //create new data
    const newVideo = {
      ...req.body,
      channel: "Scotty Cranmer",
      image: "https://i.imgur.com/i6S8m7I.jpg",
      views: "0",
      likes: "0",
      duration: "4:20",
      video: "https://project-2-api.herokuapp.com/stream",
      timestamp: +new Date(),
      comments: [],
      id: uuid(),
    };
    //add data to existing data
    videos.push(newVideo);
    //write data to existing file
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    //send back response
    res.status(200).json(newVideo);
  });

//Set up route for /videos/:id endpoint
router.get("/:id", (req, res) => {
  //get id from url
  const requestedID = String(req.params.id);
  //get existing data
  const videos = readVideos();
  //handle no data passed in url
  if (!videos.find((video) => video.id === requestedID)) {
    return res.status(404).send("Can't find video, please use a different id");
  }
  //send back response with matching data
  return res.status(200).json(videos.find((video) => video.id === requestedID));
});

module.exports = router;
