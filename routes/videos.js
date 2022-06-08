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
      image: "http://localhost:8080/Upload-video-preview.jpg",
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
  const requestedVideoId = String(req.params.id);
  //get existing data
  const videos = readVideos();
  //Get requested video
  const requestedVideo = videos.find((video) => video.id === requestedVideoId);
  //handle no data passed in url
  if (!requestedVideo) {
    return res.status(404).send("Can't find video, please use a different id");
  }
  //send back response with matching data
  return res.status(200).json(requestedVideo);
});

//Set up a route for /videos/:id/comments endpoint
router.post("/:id/comments", (req, res) => {
  //get id from url
  const currentVideoId = String(req.params.id);
  //Get existing data
  const videos = readVideos();
  //find the index of current video that we adding comments to
  const indexOfCurrentVideo = videos.findIndex(
    (video) => video.id === currentVideoId
  );
  //create a new comment
  const newComment = {
    name: req.body.name,
    comment: req.body.comment,
    likes: 0,
    timestamp: +new Date(),
  };
  //modify the videos array
  videos[indexOfCurrentVideo].comments.push(newComment);
  //write it into our data
  writeVideos(videos);
  //send back a response of newComment
  res.status(201).json(newComment);
});

//Set up a route for /videos/:videoId/comments/:commentId for deleting a comment.
//NOTE: WE ARE USING TIMESTAMP TO DELETE COMMENT BECAUSE EXISTING DATA DOES NOT HAVE ID
router.delete("/:videoId/comments/:commentId", (req, res) => {
  //get id from url
  const currentVideoId = String(req.params.videoId);
  //get id of comment
  const commentId = Number(req.params.commentId);
  //Get existing data
  const videos = readVideos();
  //find the index of current video that we adding comments to
  const indexOfCurrentVideo = videos.findIndex(
    (video) => video.id === currentVideoId
  );
  //find the index of current comment in the current video object
  const indexOfComment = videos[indexOfCurrentVideo].comments.findIndex(
    (comment) => comment.timestamp === commentId
  );
  //delete comment from comments object
  const deletedComment = videos[indexOfCurrentVideo].comments.splice(
    indexOfComment,
    1
  );
  //write it into our data
  writeVideos(videos);
  //send back a response
  res.status(200).json(deletedComment);
});

module.exports = router;
