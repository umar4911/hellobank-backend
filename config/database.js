const mongoose = require("mongoose");
require("dotenv/config");
const { DB } = require("../config");

const Logger = require("../src/utils/Logger");
const logger = new Logger();

mongoose
  .connect(DB.database)
  .then(async () => {
    logger.info(`We are finally Connected with the database!!`);
  })
  .catch((e) => console.error("error: ", e));
