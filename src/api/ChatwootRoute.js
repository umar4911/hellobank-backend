const router = require("express").Router();
const ChatwootController = require("../controllers/ChatwootController");
const Middleware = require("../cors/Middleware");

module.exports = () => {
  router.use(Middleware.NoAuthenticate);
  router.post("/webhook", ChatwootController.HandleWebhook);
  return router;
};
