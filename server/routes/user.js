const userRoutes = require("express").Router();

const { User } = require("../db");
const { getCookieOptions } = require("../utils");

// Register
userRoutes.post("/", async (req, res) => {
  const { username, password } = req.body;

  // This is a demo server, so no need to have complicated validations.
  if (username.length > 10 || password.length > 10) {
    res.status(400).send({ error: "Too long username/password" });
  }

  try {
    // Create the user
    const user = User.build({
      username,
      password
    });

    // Save it to the database
    await user.save();

    // Sign the user in.
    return res.cookie("auth", user.getJwt(), getCookieOptions()).send({
      user: user.json()
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Error" });
  }
});

module.exports = userRoutes;
