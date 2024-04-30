const express = require("express");

const Router = express.Router();

const uuid = require("uuid");

let users = require("../models/users");
const router = require("./usercontrollersdb");
const { status } = require("express/lib/response");
const bcrypt = require("bcryptjs");

//reading informarion
router.get("/", (req, res) => {
  res.json(users);
});

/**
 * @openapi
 * /:
 *   get:
 *     description: Class-user-demo Api  !
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */

router.get("/:id", (req, res) => {
  const found = users.some((user) => user.id === parseInt(req.params.id));
  if (found) {
    res.json(users.filter((user) => user.id === parseInt(req.params.id)));
  } else {
    res.sendStatus(404);
    res.json({ message: `no record found by id ${req.params.id}` });
  }
});

// creating data

router.post("/", (req, res) => {
  const newUser = {
    id: uuid.v4(),

    name: req.params.name,

    email: req.params.email,
  };
  const salt = bcrypt.genSalt(10);

  if (!newUser.name || !newUser.email) {
    return res.json({ message: "email and name cant be kept" });
  }

  users.push(newUser);
  res.json(users);
});

// update data

router.put("/:id", (req, res) => {
  const found = users.some((user) => user.id === parseInt(req.params.id));

  if (found) {
    const updateUser = req.body;

    users.forEach((user) => {
      if (user.id === parseInt(req.params.id)) {
        user.name = updateUser.name ? updateUser.name : user.name;

        user.email = updateUser.email ? updateUser.email : user.email;

        user.password = updateUser.email ? updateUser.email : user.password;

        res.json({ status: 200, message: "User updated", user });
      }
    });
  } else {
    res.json({ statusCode: 400, message: "Invalid request" });
  }
});

// delete data

router.delete("/:id", (req, res) => {
  const found = users.some((user) => user.id === parseInt(req.params.id));
  if (found) {
    users = users.filter((user) => user.id !== parseInt(req.params.id));

    res.json({
      status: 200,
      message: "user deleted",
      users,
    });
  } else {
    res.json({ message: "imvalid request to remove data", status: 500 });
  }
});

module.exports = router;
