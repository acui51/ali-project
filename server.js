"use strict";

const express = require("express");
const http = require("http");
const path = require("path");

const initApi = require("./api");
const updater = require("./lib/server/updater");

const PORT = 1930;

let app = express();
let server = http.createServer(app);

let publicPath = path.join(__dirname, "public");
app.use("/lib/client", express.static(path.join(__dirname, "lib/client")));
app.use(express.static(publicPath));
updater(server, publicPath);

/* Return projects.html for any url of the form /projects/ ______ */
app.get("/projects/", (req, res) => {
  res.sendFile("projects.html", { root: publicPath });
});

app.get("/projects/biology", (req, res) => {
  res.sendFile("projects.html", { root: publicPath });
});

app.get("/projects/chemistry", (req, res) => {
  res.sendFile("projects.html", { root: publicPath });
});

app.get("/projects/computer-science", (req, res) => {
  res.sendFile("projects.html", { root: publicPath });
});

app.get("/projects/physics", (req, res) => {
  res.sendFile("projects.html", { root: publicPath });
});

app.get("/projects/profile.html", (req, res) => {
  res.sendFile("profile.html", { root: publicPath });
});

const main = async () => {
  await initApi(app);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
  });
};
main();
