const errors = require("./index");
const { format } = require("../src/utils/utils");

module.exports = {
  getError(res, errorCodeName, ...params) {
    if (!errors[errorCodeName]) {
      errorCodeName = "UNKNOWN_ERROR";
    }
    let errData = structuredClone(errors[errorCodeName]);
    if (params.length !== 0) {
      console.log(params, errData.message);
      errData.message = format(errData.message, ...params);
      console.log(errData.message);
    }

    res.status(errData.statusCode);
    // delete errData.statusCode;

    return res.json(errData);
  },
};
