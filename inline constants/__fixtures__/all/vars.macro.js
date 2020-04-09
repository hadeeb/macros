//@ts-check
const createConstantMacro = require("../../macro");

const sum = 100 + 23;

const data = {
  isProduction: process.env.NODE_ENV === "production",
  num: sum,
};

module.exports = createConstantMacro(data);
