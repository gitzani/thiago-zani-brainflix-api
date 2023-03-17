const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const upload = multer();
const { v4: uuidv4 } = require("uuid");
const dataPath = "./src/data/data.json";



router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.send("Hello World");
});
router.get("/videos", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) throw err;
    const videos = JSON.parse(data);
    res.send(videos);
  });
});

router.get("/videos/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) throw err;
      const videos = JSON.parse(data);
      const video = videos.find((video) => video.id === id);
      if (video) {
        res.send(video);
      } else {
        res.status(404).send("Video not found");
      }
    });
  });

  router.post("/videos/:id/comments", upload.none(), (req, res) => {
    const id = req.params.id;
    const { name, comment } = req.body;
    const newComment = {
      id: uuidv4(),
      name: name || `guest_${uuidv4()}`,
      comment: comment,
      likes: 0,
      timestamp: Date.now(),
    };
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) throw err;
      const videos = JSON.parse(data);
      const videoIndex = videos.findIndex((video) => video.id === id);
      if (videoIndex === -1) {
        res.status(404).send("Video not found");
        return;
      }
      videos[videoIndex].comments.push(newComment);
      fs.writeFile(dataPath, JSON.stringify(videos), (err) => {
        if (err) throw err;
        res.send(videos);
      });
    });
  });

  router.post('/videos', (req, res) => {
    const { title, description, video } = req.body;
    const channel = `Guest Channel`;
    const image = "https://picsum.photos/200/300";
    const newVideo = {
      id: uuidv4(), // Generate a unique id for the new video
      title: title,
      channel: channel,
      image: image,
      description: description,
      duration: '',
      video: video,
      views: '0',
      likes: '0',
      timestamp: Date.now(),
      comments: []
    };
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) throw err;
      const videos = JSON.parse(data);
      const videoIndex = videos.findIndex((video) => video.id === newVideo.id);
      console.log(videos);
      videos.push(newVideo);// Add the new video to the videos array
      fs.writeFile(dataPath, JSON.stringify(videos), (err) => {
        if (err) throw err;
        res.status(201).json(newVideo); // Return the new video with a 201 status code
      });
    });
  }); // <-- added the closing curly brace here

    

  
  
  
module.exports = router;