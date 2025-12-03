const Status = require("../constants/Status.json");
const moment = require("moment");

const Logger = require("../utils/Logger");
const ErrorManager = require("../../errors/error-manager");

const logger = new Logger();

const { environment } = require("../../config");
const DBService = require("../services/DBService");
const { GenerateRandomNum } = require("../utils/utils");

module.exports = {
  GetAccountList: async (req, res) => {
    try {
      const users = await DBService.User.FindUser({});

      const data = users.map((u) => ({
        _id: u._id,
        fname: u.fname,
        lname: u.lname,
        cnic: u.cnic,
        account_no: u.account_no,
        balance: u.balance,
        closed: u.closed,
      }));

      return res.json({
        status: Status.SUCCESS,
        message: "Users List.",
        data,
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  GetTickets: async (req, res) => {
    try {
      const data = await DBService.Ticket.Find({ status: "open" });

      return res.json({
        status: Status.SUCCESS,
        message: "Ticket list.",
        data,
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  ResolveTicket: async (req, res) => {
    const { id, reply } = req.body;
    if (!id || !reply) {
      return ErrorManager.getError(res, "INCOMPLETE_ARGS");
    }

    try {
      const ticket = await DBService.Ticket.FindOne({ _id: id });

      if (!ticket) {
        return ErrorManager.getError(res, "TICKET_DOESNOT_EXISTS");
      }

      if (ticket.status !== "open") {
        return ErrorManager.getError(res, "TICKET_ALREADY_RESOLVED");
      }

      await DBService.Ticket.Update(
        { _id: id },
        {
          reply: {
            sender: "admin",
            message: reply,
            createdAt: new Date(),
          },
          status: "closed",
        },
      );

      return res.json({
        status: Status.SUCCESS,
        message: "Ticket resolved.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  GetUserCards: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      const data = await DBService.Card.GetCards({ userId });

      return res.json({
        status: Status.SUCCESS,
        message: "Cards List.",
        data,
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  IssueCard: async (req, res) => {
    const { userId } = req.params;
    const { type } = req.body;

    if (
      !userId ||
      !type ||
      (type !== "Silver" && type !== "Gold" && type !== "Platinum")
    ) {
      return ErrorManager.getError(res, "INCOMPLETE_ARGS");
    }

    try {
      const user = await DBService.User.FindOne({ _id: userId });

      const existingCards = await DBService.Card.GetCards({
        userId,
        type,
        isblocked: false,
      });

      if (!user) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }
      if (user.closed) {
        return ErrorManager.getError(res, "ACCOUNT_CLOSED");
      }
      if (existingCards.length > 0) {
        return ErrorManager.getError(res, "CARD_TYPE_ALREADY_EXISTS");
      }

      const cardnumber = "1234" + GenerateRandomNum(12);
      const cvc = GenerateRandomNum(3);
      const expiration = moment().add(5, "years").toDate();

      await DBService.Card.IssueCard({
        userId,
        type,
        cardnumber,
        cvc,
        expiration,
      });

      return res.json({
        status: Status.SUCCESS,
        message: "Card issued.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  BlockCard: async (req, res) => {
    const { cardId } = req.body;
    if (!cardId) {
      return ErrorManager.getError(res, "INCOMPLETE_ARGS");
    }

    try {
      const card = await DBService.Card.GetCard({
        _id: cardId,
        isblocked: false,
      });

      if (!card) {
        return ErrorManager.getError(res, "NO_ACTIVE_CARD");
      }

      await DBService.Card.UpdateCard({ _id: cardId }, { isblocked: true });

      return res.json({
        status: Status.SUCCESS,
        message: "Card blocked.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  CloseUserAccount: async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
      return ErrorManager.getError(res, "INCOMPLETE_ARGS");
    }

    try {
      const user = await DBService.User.FindOne({ _id: userId });
      if (!user) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }

      if (user.closed) {
        return ErrorManager.getError(res, "ACCOUNT_CLOSED");
      }

      await DBService.User.UpdateUser({ closed: true }, { _id: userId });

      await DBService.Card.UpdateCard({ userId }, { isblocked: true });

      return res.json({
        status: Status.SUCCESS,
        message: "Account closed.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  AddMoney: async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!userId || !amount || isNaN(amount)) {
      return ErrorManager.getError(res, "INCOMPLETE_ARGS");
    }

    const amt = Number(amount);

    try {
      const user = await DBService.User.FindOne({ _id: userId });
      if (!user) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }

      if (user.closed) {
        return ErrorManager.getError(res, "ACCOUNT_CLOSED");
      }

      await DBService.User.UpdateUser(
        { balance: user.balance + amt },
        { _id: userId },
      );

      await DBService.Transaction.Create({
        userId: null,
        name: "Admin",
        account_no: user.account_no,
        bank: "HelloBank",
        amount: amt,
        type: "transfer",
      });

      return res.json({
        status: Status.SUCCESS,
        message: "Balance updated.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
};
