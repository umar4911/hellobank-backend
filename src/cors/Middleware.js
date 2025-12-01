const jwt = require("jsonwebtoken");
const { JwtKey } = require("../../config");
const DBService = require("../services/DBService");
const Logger = require("../utils/Logger");
const ErrorManager = require("../../errors/error-manager");

const logger = new Logger();

module.exports = {
  NoAuthenticate: async (req, res, next) => {
    next();
  },
  UserAuth: async (req, res, next) => {
    try {
      let token = req.headers["x-access-token"] || req.headers["authorization"];
      if (token && token.split(" ").length !== 1) token = token.split(" ")[1];

      if (!token) {
        return ErrorManager.getError(res, "UNAUTHORIZED");
      }
      const decoded = jwt.verify(token, JwtKey);
      const user = await DBService.User.FindOne({ _id: decoded._id });
      if (!user) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }
      if (user.closed) {
        return ErrorManager.getError(res, "ACCOUNT_CLOSED");
      }
      req.user = user;

      next();
    } catch (e) {
      logger.error(e.message + "\n" + e.stack);
      return ErrorManager.getError(res, "UNAUTHORIZED");
    }
  },
};
