const router = require("express").Router();

const BeneficiaryController = require("../controllers/BeneficiaryController");
const Middleware = require("../cors/Middleware");

module.exports = () => {
  router.use(Middleware.UserAuth);
  router.get("/", BeneficiaryController.GetList);
  router.post("/", BeneficiaryController.Add);
  router.patch("/:bid", BeneficiaryController.Modify);
  router.delete("/:bid", BeneficiaryController.Delete);

  return router;
};
