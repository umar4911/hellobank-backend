module.exports = {
  port: process.env.PORT || 5001,
  JwtKey: process.env.JWT_KEY || "",
  environment: process.env.NODE_ENV || "dev",
  LOGGER_LEVEL: "info",
  DB: {
    database: process.env.DBURL || "",
  },
  CARD_DAILY_LIMITS: {
    Silver: 50000,
    Gold: 100000,
    Platinum: 250000,
  },
  Chatwoot: {
    baseUrl: process.env.CHATWOOT_BASE_URL,
    accountId: process.env.CHATWOOT_ACCOUNT_ID,
    botToken: process.env.CHATWOOT_BOT_TOKEN,
  },
};
