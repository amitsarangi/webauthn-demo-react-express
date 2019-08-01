require("dotenv").config({ path: "./server/.env" });
const express = require("express");
var cookieParser = require("cookie-parser");
const session = require("express-session");

const { sequelize } = require("./db");
const { PORT = 5050, SESSION_SECRET = "" } = process.env;

const { getCookieOptions } = require("./utils");

// Initialize express app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    cookie: {
      ...getCookieOptions()
    },
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessId"
  })
);

// Initialize Middlewares
const verifyLoggedInMiddleware = require("./middlewares/verifyLoggedIn");
app.use(verifyLoggedInMiddleware);

// Initialize routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Initialize database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
});
