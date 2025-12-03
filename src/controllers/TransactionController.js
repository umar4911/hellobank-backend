const Status = require("../constants/Status.json");

const Logger = require("../utils/Logger");
const ErrorManager = require("../../errors/error-manager");

const logger = new Logger();

const { environment } = require("../../config");
const DBService = require("../services/DBService");
const moment = require("moment");

module.exports = {
  TransferMoney: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || isNaN(amount)) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      const amt = Number(amount);

      if (amt < 10) {
        return ErrorManager.getError(res, "MINIMUM_TRANSACTION_ERROR");
      }

      const beneficiary = await DBService.Beneficiary.FindOne({
        _id: id,
        userId: req.user._id,
      });

      if (!beneficiary) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }

      if (amt > req.user.balance) {
        return ErrorManager.getError(res, "NOT_ENOUGH_BALANCE");
      }

      let receiver = null;
      if (beneficiary.bank === "HelloBank") {
        receiver = await DBService.User.FindOne({
          account_no: beneficiary.account_no,
        });

        if (!receiver) {
          return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
        }
      }

      await DBService.Transaction.Create({
        userId: req.user._id,
        name: beneficiary.name,
        account_no: beneficiary.account_no,
        bank: beneficiary.bank,
        amount: amt,
        type: "transfer",
      });

      await DBService.User.UpdateUser(
        { balance: req.user.balance - amt },
        { _id: req.user._id },
      );

      if (receiver) {
        await DBService.User.UpdateUser(
          { balance: receiver.balance + amt },
          { _id: receiver._id },
        );
      }

      return res.json({
        status: Status.SUCCESS,
        message: "Amount transferred.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  GetStatement: async (req, res) => {
    try {
      let { start, end } = req.query;
      if (!start) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      start = moment(start, "YYYY-MM-DD").toDate();
      if (end) {
        end = moment(end, "YYYY-MM-DD").toDate();
      }

      const list = await DBService.Transaction.List(
        {
          $or: [{ userId: req.user._id }, { account_no: req.user.account_no }],
        },
        start,
        end,
      );

      const data = list.map((x) => {
        const isDebit = x.userId.toString() === req.user._id.toString();
        return {
          tid: x._id,
          time: x.time,
          name: x.name,
          credit: !isDebit ? x.amount : 0,
          debit: isDebit ? x.amount : 0,
          type: x.type,
          account_no: x.account_no,
          bank: x.bank,
        };
      });

      return res.json({
        status: Status.SUCCESS,
        message: "Statement.",
        data,
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
};
