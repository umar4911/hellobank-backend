const fs = require("fs");
const Admins = require("../constants/Admins.json");

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

function format(template, ...params) {
  if (params.length === 0) {
    return template;
  }

  return template.replace(/%s/g, () => {
    const nextParam = params.shift();
    return nextParam !== undefined ? String(nextParam) : "%s";
  });
}

function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }
  return false;
}

function getAdminDetails(email) {
  return Admins.find((admin) => admin.email === email);
}
module.exports = {
  capitalizeString,
  GenerateRandomNum,
  format,
  isEmail,
  getAdminDetails,
};
