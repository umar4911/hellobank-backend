const router = require("express").Router();

const UserController = require("../controllers/UserController");
const Middleware = require("../cors/Middleware");

module.exports = () => {
  router.use(Middleware.UserAuth);
  router.get("/", UserController.GetInfo);
  router.patch("/update/email", UserController.UpdateEmail);
  router.patch("/update/password", UserController.UpdatePassword);

  return router;
};
