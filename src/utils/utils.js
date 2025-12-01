const { EncryptionKey } = require("../../config");
const fs = require("fs");

function capitalizeString(string) {
  if (string) {
    string = String(string);
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else return string;
}

function GenerateRandomNum(num) {
  let randomNumber = "";
  for (let i = 0; i < num; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return randomNumber;
}

function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }
  return false;
}

module.exports = {
  capitalizeString,
  GenerateRandomNum,
  isEmail,
};
