require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { MongoClient } = require("mongodb");
let DATABASE_NAME = "193x_project";

let api = express.Router();
let conn;
let db;
let Users, Projects, Questions, Applications;

console.log(process.env.CLIENT_ID);

module.exports = async (app) => {
  app.set("json spaces", 2);
  // Connect to database
  conn = await MongoClient.connect("mongodb://localhost", {
    useUnifiedTopology: true,
  });
  db = conn.db(DATABASE_NAME);
  Users = db.collection("users");
  Projects = db.collection("projects");
  Questions = db.collection("questions");
  Applications = db.collection("applications");
  app.use("/api", api);
};

api.use(cors());
api.use(bodyParser.json());

// API Requests
api.get("/", (req, res) => {
  res.json({ success: true });
});

/*********** USER.JS ***********/

// List users
api.get("/users", async (req, res) => {
  let users = await Users.find().toArray();
  res.json({ users: users.map((user) => user.id) });
});

// Middleware Function
api.use("/users/:id", async (req, res, next) => {
  let id = req.params.id;
  let user = await Users.findOne({ id: id });
  if (!user) {
    res.status(404).json({ error: "User doesn't exist" });
    return;
  }
  res.locals.user = user;
  next();
});

// Get user info
api.get("/users/:id", (req, res) => {
  let user = res.locals.user;
  let { id, name, school, following, applied, qna } = user;
  res.json({ id, name, school, following, applied, qna });
});

// Create new user
api.post("/users", async (req, res) => {
  // Error checking
  // Request body is missing id or empty
  if (!req.body.id) {
    res
      .status(400)
      .json({ error: "Request body is missing id property or id is empty" });
  }
  await Users.insertOne({
    id: req.body.id,
    name: req.body.name,
    school: "",
    following: [],
    applied: [],
    qna: {},
  });
  let user = await Users.findOne({ id: req.body.id });
  res.json(user);
});

// Update User profile
api.patch("/users/:id", async (req, res) => {
  let user = res.locals.user;
  let name = req.body.name;
  let school = req.body.school;
  let qna = req.body.qna;
  if (req.body.name) {
    user.name = name;
  }
  if (req.body.school) {
    user.school = school;
  }
  if (req.body.qna) {
    user.qna = qna;
  }
  await Users.replaceOne({ id: user.id }, user);
  delete user._id;
  res.json({ id: user.id, name, school, qna });
});

/*********** PROJECTS.JS **********/

// Get all projects
api.get("/projects", async (req, res) => {
  let projects = await Projects.find().toArray();
  res.json(projects);
});

// Get specific project
api.get("/projects/:id", async (req, res) => {
  let id = req.params.id;
  let project = await Projects.findOne({ id: id });
  res.json(project);
});

// Follow a project
api.post("/users/:id/follow", async (req, res) => {
  let user = res.locals.user;
  let follow = req.query.target;
  user.following.push(JSON.parse(follow));
  await Users.replaceOne({ id: user.id }, user);
  res.json({ success: true });
});

// Unfollow a project
api.delete("/users/:id/follow", async (req, res) => {
  let user = res.locals.user;
  let follow = JSON.parse(req.query.target);
  let index = user.following
    .map(function (a) {
      return a.id;
    })
    .indexOf(follow.id);
  user.following.splice(index, 1);
  await Users.replaceOne({ id: user.id }, user);
  res.json({ success: true });
});

// Apply to a project
api.post("/users/:id/apply", async (req, res) => {
  let user = res.locals.user;
  let apply = req.query.target;
  user.applied.push(JSON.parse(apply));
  await Users.replaceOne({ id: user.id }, user);
  await Applications.insertOne({
    id: user.id,
    name: user.name,
    projectid: JSON.parse(apply).id,
    qna: { ...user.qna, school: user.school },
  });

  res.json({ success: true });
});

/************ QUESTIONS.JS ***********/

api.get("/questions", async (req, res) => {
  let questions = await Questions.find().toArray();
  res.json(questions);
});

/************ GOOGLESIGNIN.JS ***********/

api.get("/google", async (req, res) => {
  let [type, token] = req.header("Authorization").split(" ");
  let client = new OAuth2Client();
  /* "audience" is the client ID the token was created for. A mismatch would mean the user is
     trying to use an ID token from a different app */
  let login = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  /* Contains a bunch of profile info */
  res.json(login.getPayload());
});

/* Catch-all route to return a JSON error if endpoint not defined */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});
