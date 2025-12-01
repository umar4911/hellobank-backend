const Status = require("../constants/Status.json");

const Logger = require("../utils/Logger");
const ErrorManager = require("../../errors/error-manager");

const logger = new Logger();

const { environment } = require("../../config");
const DBService = require("../services/DBService");

module.exports = {
  GetList: async (req, res) => {
    try {
      const data = await DBService.Beneficiary.List({ userId: req.user._id });

      return res.json({
        status: Status.SUCCESS,
        message: "Beneficiaries.",
        data,
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  Add: async (req, res) => {
    try {
      const { nickname, account_no, bank } = req.body;
      if (!nickname || !account_no || !bank) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      if (account_no === req.user.account_no) {
        return ErrorManager.getError(res, "BENEFICIARY_ITSELF");
      }

      const BeneficiaryExists = await DBService.Beneficiary.FindOne({
        account_no,
        userId: req.user._id,
      });

      if (BeneficiaryExists) {
        return ErrorManager.getError(res, "BENEFICIARY_ALREADY_EXISTS");
      }

      let username = nickname;

      if (bank === "HelloBank") {
        const AccountExists = await DBService.User.FindOne({ account_no });

        if (!AccountExists) {
          return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
        }

        username = `${AccountExists.fname} ${AccountExists.lname}`;
      }

      await DBService.Beneficiary.Create({
        name: username,
        nickname,
        userId: req.user._id,
        account_no,
        bank,
      });

      return res.json({
        status: Status.SUCCESS,
        message: "Beneficiary Added.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  Modify: async (req, res) => {
    try {
      const { bid } = req.params;
      const { nickname } = req.body;
      if (!bid || !nickname) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      const ben = await DBService.Beneficiary.FindOne({ _id: bid });

      if (!ben) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }

      if (ben.userId.toString() !== req.user._id.toString()) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }

      await DBService.Beneficiary.Update(
        { _id: bid, userId: req.user._id },
        { nickname },
      );

      return res.json({
        status: Status.SUCCESS,
        message: "Beneficiary updated.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  Delete: async (req, res) => {
    try {
      const { bid } = req.params;
      if (!bid) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      const ben = await DBService.Beneficiary.FindOne({ _id: bid });

      if (!ben) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }

      if (ben.userId.toString() !== req.user._id.toString()) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }

      await DBService.Beneficiary.Delete({ _id: bid, userId: req.user._id });

      return res.json({
        status: Status.SUCCESS,
        message: "Beneficiary deleted.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
};
