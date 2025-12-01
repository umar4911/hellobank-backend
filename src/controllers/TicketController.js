const Status = require("../constants/Status.json");

const Logger = require("../utils/Logger");
const ErrorManager = require("../../errors/error-manager");

const logger = new Logger();

const { environment } = require("../../config");
const DBService = require("../services/DBService");

module.exports = {
  GetList: async (req, res) => {
    try {
      const data = await DBService.Ticket.Find({
        userId: req.user._id,
      });

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

  CreateTicket: async (req, res) => {
    try {
      const { subject, message } = req.body;
      if (!subject || !message) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      await DBService.Ticket.Create({
        userId: req.user._id,
        subject,
        message,
      });

      return res.json({
        status: Status.SUCCESS,
        message: "Ticket created.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },

  ReplyTicket: async (req, res) => {
    try {
      const { id } = req.params;
      const { sender, message } = req.body;

      if (!sender || !message) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      const ticket = await DBService.Ticket.FindOne({ _id: id });

      if (!ticket) {
        return ErrorManager.getError(res, "TICKET_NOT_FOUND");
      }

      await DBService.Ticket.Update(
        { _id: id },
        {
          reply: {
            sender,
            message,
            createdAt: new Date(),
          },
          status: "closed",
        },
      );

      return res.json({
        status: Status.SUCCESS,
        message: "Ticket solved.",
        data: {},
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
};
