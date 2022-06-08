const express = require("express");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const router = express.Router();
const { readVideos, writeVideos } = require("../utilities/utilities");

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
    writeVideos(videos);
    //send back a response
    res.status(200).json(newVideo);
  });

//Set up a route for /videos/:id endpoint
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

//Set up a route for /videos/:id/comments endpoint
router.post("/:id/comments", (req, res) => {
  //get id from url
  const requestedID = String(req.params.id);
  //Get existing data
  const videos = readVideos();
  //find the index of current video that we adding comments to
  const indexOfVideo = videos.findIndex((video) => video.id === requestedID);
  //create a new comment
  const newComment = {
    name: req.body.name,
    comment: req.body.comment,
    likes: 0,
    timestamp: +new Date(),
  };
  //modify the videos array
  videos[indexOfVideo].comments.push(newComment);
  //write it into our data
  writeVideos(videos);
  //send back a response of newComment
  res.status(200).json(newComment);
});

//Set up a route for /videos/:videoId/comments/:commentId for deleting a comment
router.delete("/:videoId/comments/:commentId", (req, res) => {
  //get id from url
  const requestedId = String(req.params.videoId);
  //get id of comment
  const commentId = Number(req.params.commentId);
  //Get existing data
  const videos = readVideos();
  //find the index of current video that we adding comments to
  const indexOfVideo = videos.findIndex((video) => video.id === requestedId);
  //find the index of current comment in the current video object
  const indexOfComment = videos[indexOfVideo].comments.findIndex(
    (comment) => comment.timestamp === commentId
  );
  //delete comment from comments object
  videos[indexOfVideo].comments.splice(indexOfComment, 1);
  //write it into our data
  writeVideos(videos);
  //send back a response
  res.status(200).json(videos[indexOfVideo].comments.splice(indexOfComment, 1));
});

module.exports = router;
