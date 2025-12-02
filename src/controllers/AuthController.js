const Status = require("../constants/Status.json");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const bcrypt = require("bcrypt");

const Logger = require("../utils/Logger");
const ErrorManager = require("../../errors/error-manager");

const logger = new Logger();

const { JwtKey, environment } = require("../../config");
const DBService = require("../services/DBService");
const {
  GenerateRandomNum,
  isEmail,
  getAdminDetails,
} = require("../utils/utils");

module.exports = {
  Login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return ErrorManager.getError(res, "WRONG_CREDENTIALS");
      }

      const User = await DBService.User.FindOne({ email });
      if (!User) {
        return ErrorManager.getError(res, "WRONG_CREDENTIALS");
      }
      if (!bcrypt.compareSync(password, User.password)) {
        return ErrorManager.getError(res, "WRONG_CREDENTIALS");
      }

      const logintoken = jwt.sign({ _id: User._id }, JwtKey);

      return res.json({
        status: Status.SUCCESS,
        message: "Login successful.",
        data: {
          logintoken,
        },
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
  Register: async (req, res) => {
    try {
      const { fname, lname, cnic, address, gender, bdate, email, password } =
        req.body;

      if (
        !fname ||
        !lname ||
        !cnic ||
        !address ||
        !gender ||
        !bdate ||
        !email ||
        !isEmail(email) ||
        !password ||
        cnic.length !== 13 ||
        (gender !== "m" && gender !== "f") ||
        password.length < 6
      ) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      const [CNICExists, EmailExists] = await Promise.all([
        DBService.User.FindOne({ cnic }),
        DBService.User.FindOne({ email }),
      ]);
      if (CNICExists) {
        return ErrorManager.getError(res, "USER_FIELD_ALREADY_EXISTS", "CNIC");
      }

      if (EmailExists) {
        return ErrorManager.getError(res, "USER_FIELD_ALREADY_EXISTS", "email");
      }

      const age = moment().diff(moment(bdate), "years");
      if (age < 18) {
        return ErrorManager.getError(res, "AGE_LESS_THAN_18");
      }

      const account_no = "1234" + GenerateRandomNum(10);

      const User = await DBService.User.CreateUser({
        fname,
        lname,
        cnic,
        address,
        gender,
        bdate,
        email,
        account_no,
        password: bcrypt.hashSync(password, 10),
      });

      const logintoken = jwt.sign({ _id: User._id }, JwtKey);

      return res.json({
        status: Status.SUCCESS,
        message: "Register successful.",
        data: {
          logintoken,
        },
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
  AdminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return ErrorManager.getError(res, "WRONG_CREDENTIALS");
      }

      const User = getAdminDetails(email);
      if (!User) {
        return ErrorManager.getError(res, "WRONG_CREDENTIALS");
      }
      if (User.password !== password) {
        return ErrorManager.getError(res, "WRONG_CREDENTIALS");
      }

      const logintoken = jwt.sign({ email: User.email }, JwtKey);

      return res.json({
        status: Status.SUCCESS,
        message: "Login successful.",
        data: {
          logintoken,
        },
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
};
