//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", () => {
  console.log("Connected to the database.");
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, result) => {
      if (!err) {
        res.send(result);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("New Article saved!");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all articles!");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send("No matching article found");
      }
    });
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated!");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully updated!");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Successfully deleted the article!");
      }
    });
  });

app.listen("3000", () => {
  console.log("Server started on port 3000.");
});
