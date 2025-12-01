const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const Logger = require("../src/utils/Logger");

const ErrorManager = require("../errors/error-manager");

const logger = new Logger();

const { port } = require("../config");
const app = express();
const moment = require("moment");
const momenttz = require("moment-timezone");

moment.tz.setDefault("Asia/Karachi");

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json({ limit: "10mb" }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return ErrorManager.getError(res, "INVALID_ARGUMENTS");
  } else {
    next(err);
  }
});

const AuthRoute = require("../src/api/AuthRoute")();
app.use("/auth/", AuthRoute);

const UserRoute = require("../src/api/UserRoute")();
app.use("/user/", UserRoute);

app.use(/.*/, async (req, res) => {
  return ErrorManager.getError(res, "PAGE_NOT_FOUND");
});

app.listen(port, "0.0.0.0", () => {
  logger.info(`Working with port ${port}`);
});
