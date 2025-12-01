const { EncryptionKey } = require("../../config");
const fs = require("fs");

function capitalizeString(string) {
  if (string) {
    string = String(string);
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else return string;
}

module.exports = {
  capitalizeString,
};
