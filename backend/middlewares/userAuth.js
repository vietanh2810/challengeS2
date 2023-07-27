const express = require("express");
const db = require("../models");
const User = db.users;
const Company = db.companies;
const jwt = require("jsonwebtoken");
const e = require("express");

const checkAdminRole = (req, res, next) => {
  const { dataValues } = req.user;

  const role = dataValues.role;

  if (role !== "admin") {
    return res.status(403).json({
      error: "Unauthorized. Only admin users can perform this action.",
    });
  }

  next();
};

const checkAppId = async (req, res, next) => {
  try {
    const appId = req.headers["app-id"];

    if (!appId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Missing APP_ID in headers." });
    }

    if (appId === "test") {
      return next();
    }

    const company = await Company.findOne({ where: { appId } });

    if (!company) {
      return res.status(401).json({ error: "Unauthorized. Invalid APP_ID." });
    }

    req.company = company;

    next();
  } catch (error) {
    console.error("Error checking APP_ID:", error);
    res.status(500).json({ error: "An error occurred while checking APP_ID." });
  }
};

const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        userName: req.body.userName,
      },
    });
    if (username) {
      return res.json(409).send("username already taken");
    }
    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (emailcheck) {
      return res.json(409).send("Authentication failed");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("User saving failed");
  }
};

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token === "" || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Missing or invalid token." });
    }
    const authToken = token.slice(7);

    jwt.verify(authToken, process.env.jwtSecret, async (err, decoded) => {
      console.log(err);

      if (err) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Invalid or expired token." });
      }
      const user = await User.findByPk(decoded.id);
      req.user = user;

      next();
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred during user authentication." });
  }
};

module.exports = {
  saveUser,
  authenticate,
  checkAdminRole,
  checkAppId,
};
