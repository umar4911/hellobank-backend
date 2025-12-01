const router = require("express").Router();

const TicketController = require("../controllers/TicketController");
const Middleware = require("../cors/Middleware");

module.exports = () => {
  router.use(Middleware.UserAuth);
  router.get("/", TicketController.GetList);
  router.post("/", TicketController.CreateTicket);
  router.patch("/:id", TicketController.ReplyTicket);

  return router;
};
