const router = require("express").Router();

const AdminController = require("../controllers/AdminController");
const Middleware = require("../cors/Middleware");

module.exports = () => {
  router.use(Middleware.AdminAuth);

  router.get("/users", AdminController.GetAccountList);
  router.get("/tickets", AdminController.GetTickets);
  router.post("/resolve-ticket", AdminController.ResolveTicket);

  router.get("/user-cards/:userId", AdminController.GetUserCards);
  router.post("/issue-card/:userId", AdminController.IssueCard);
  router.post("/close-account/:userId", AdminController.CloseUserAccount);
  router.post("/add-money/:userId", AdminController.AddMoney);

  router.post("/block-card", AdminController.BlockCard);

  return router;
};
