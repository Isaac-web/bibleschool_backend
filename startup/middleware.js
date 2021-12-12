const express = require("express");
const cors = require("cors");

module.exports = (app) => {
  app.use(express.json());
  app.use("/uploads/images", express.static("uploads/images"));
  app.use("/uploads/files", express.static("uploads/files"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
};
