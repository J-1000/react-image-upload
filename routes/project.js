const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task");

const { cloudinary } = require('../configs/cloudinary');

// GET /api/projects
router.get("/", (req, res) => {
  // return all projects
  Project.find({})
    .populate("tasks")
    .then(projects => {
      res.json(projects);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// GET /api/projects/:id
router.get("/:id", (req, res) => {
  // return 1 project w/ a given id
  const projectId = req.params.id;

  Project.findById(projectId)
    .populate("tasks")
    .then(project => {
      if (!project) {
        res.status(404).json({ message: "Project not found" });
      } else res.json(project);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// POST /api/projects
router.post("/", (req, res) => {
  // create 1 project
  console.log(req.body);
  Project.create({
    title: req.body.title,
    description: req.body.description,
    owner: req.user._id,
    imageURL: req.body.imageURL,
    imagePublicID: req.body.imagePublicID
  })
    .then(project => {
      res.json(project);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// PUT /api/projects/:id
router.put("/:id", (req, res) => {
  Project.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      imageURL: req.body.imageURL,
      publicID: req.body.publicID
    },
    { new: true }
  )
    .then(project => {
      res.json(project);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// DELETE /api/projects/:id
router.delete("/:id", (req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(project => {
      // Delete the image on cloudinary
      cloudinary.uploader.destroy(project.imagePublicID);
      // Deletes all the documents in the Task collection where the value for the `_id` field is present in the `project.tasks` array
      return Task.deleteMany({ _id: { $in: project.tasks } }).then(() =>
        res.json({ message: "ok" })
      );
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
