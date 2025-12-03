const Status = require("../constants/Status.json");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const Logger = require("../utils/Logger");
const ErrorManager = require("../../errors/error-manager");

const logger = new Logger();

const { environment } = require("../../config");
const DBService = require("../services/DBService");

module.exports = {
  BuyProduct: async (req, res) => {
    try {
      const { name, cardnumber, cvc, expiration, price } = req.body;
      if (
        !name ||
        !cardnumber ||
        !cvc ||
        !expiration ||
        price == null ||
        isNaN(price)
      ) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      const basePrice = Number(price);
      if (basePrice <= 0) {
        return ErrorManager.getError(res, "INCOMPLETE_ARGS");
      }

      const card = await DBService.Card.GetCard({
        cardnumber,
        cvc,
        isblocked: false,
      });

      if (!card) {
        return ErrorManager.getError(res, "WRONG_CARD_DETAILS");
      }

      const cardExp = moment(card.expiration);

      if (cardExp.format("MM/YY") !== expiration) {
        return ErrorManager.getError(res, "WRONG_CARD_DETAILS");
      }

      if (moment().startOf("month").isSameOrAfter(cardExp.startOf("month"))) {
        return ErrorManager.getError(res, "CARD_EXPIRED");
      }

      const userId = card.userId;
      const cardId = card._id;

      let amount = basePrice;
      if (card.type === "Gold") {
        amount = amount * 0.9;
      } else if (card.type === "Platinum") {
        amount = amount * 0.8;
      }

      const user = await DBService.User.FindOne({ _id: userId });

      if (!user) {
        return ErrorManager.getError(res, "ACCOUNT_NOT_FOUND");
      }

      if (user.closed) {
        return ErrorManager.getError(res, "ACCOUNT_CLOSED");
      }

      if (user.balance < amount) {
        return ErrorManager.getError(res, "NOT_ENOUGH_BALANCE");
      }

      const limit = CARD_DAILY_LIMITS[card.type];
      const startOfDay = moment().startOf("day").toDate();
      const endOfDay = moment().endOf("day").toDate();

      const todaysPurchases = await DBService.Transaction.List(
        {
          userId,
          type: "product",
          cardId,
        },
        startOfDay,
        endOfDay,
      );

      const totalSpentToday = todaysPurchases.reduce(
        (sum, t) => sum + t.amount,
        0,
      );

      if (totalSpentToday + amount > limit) {
        return ErrorManager.getError(res, "LIMITED_REACHED");
      }

      await DBService.Transaction.Create({
        userId,
        name,
        account_no: null,
        amount,
        type: "product",
        cardId,
      });

      await DBService.User.UpdateUser(
        { balance: user.balance - amount },
        { _id: userId },
      );

      return res.json({
        status: Status.SUCCESS,
        message: "Product successfully bought.",
        data: {
          chargedAmount: amount,
          originalPrice: basePrice,
          cardType: card.type,
          name,
        },
      });
    } catch (e) {
      ErrorManager.getError(res, "UNKNOWN_ERROR");
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") throw e;
    }
  },
};
