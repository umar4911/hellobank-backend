const router = require("express").Router();

const ProductController = require("../controllers/ProductController");
const Middleware = require("../cors/Middleware");

module.exports = () => {
  router.use(Middleware.NoAuthenticate);
  router.post("/buy", ProductController.BuyProduct);

  return router;
};
