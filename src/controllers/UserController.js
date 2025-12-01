const Status = require("../constants/Status.json");

const Logger = require("../utils/Logger");
const ErrorManager = require("../../errors/error-manager");

const logger = new Logger();

const { environment } = require("../../config");
const DBService = require("../services/DBService");
const { isEmail } = require("../utils/utils");

module.exports = {
  GetInfo: async (req, res) => {
    const userObj = req.user.toObject();
    delete userObj.password;
    try {
      return res.json({
        status: Status.SUCCESS,
        message: "User details.",
        data: {
          user: userObj,
        },
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
  UpdateEmail: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !isEmail(email)) {
        return ErrorManager.getError(res, "INVALID_ARGUMENTS");
      }

      if (email === req.user.email) {
        return res.json({
          status: Status.SUCCESS,
          message: "Email updated.",
          data: {},
        });
      }

      const EmailExists = await DBService.User.FindOne({ email });
      if (EmailExists) {
        return ErrorManager.getError(res, "USER_FIELD_ALREADY_EXISTS", "email");
      }

      await DBService.User.UpdateUser({ email }, { _id: req.user._id });

      return res.json({
        status: Status.SUCCESS,
        message: "Email updated.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
  UpdatePassword: async (req, res) => {
    try {
      const { password } = req.body;
      if (!password || password.length < 6) {
        return ErrorManager.getError(res, "INVALID_ARGUMENTS");
      }

      await DBService.User.UpdateUser({ password }, { _id: req.user._id });

      return res.json({
        status: Status.SUCCESS,
        message: "Password updated.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
};
