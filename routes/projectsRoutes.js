import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    const projects = await Project.find();
    res.send(projects);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("user", "user_name -_id");
    res.send(projects);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id }).populate(
      "user",
      "user_name -_id"
    );
    if (project === null) {
      throw new Error("Not found");
    }
    res.send(project);
  } catch (err) {
    res.status(404).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id });
    res.send("Project deleted successfully");
  } catch (e) {
    res.status(404).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send("You must enter a body with at least one property");
  }
  try {
    const project = await Project.findOne({ _id: req.params.id });
    Object.entries(req.body).forEach(([key, value]) => {
      if (key !== "_id") {
        project[key] = value;
      }
    });
    await project.save();
    res.send("Project updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
