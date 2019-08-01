const { NODE_ENV = "development" } = process.env;

const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours

const isProduction = () => NODE_ENV === "production";

const getCookieOptions = () => ({
  maxAge: TWO_HOURS,
  httpOnly: true,
  secure: isProduction()
});

module.exports = {
  isProduction,
  getCookieOptions
};
