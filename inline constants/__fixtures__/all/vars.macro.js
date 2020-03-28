//@ts-check
const { createConstantMacro, objectProperty } = require("../../macro");

const sum = 100 + 23;

const data = {
  isProduction: process.env.NODE_ENV === "production",
  num: sum,
  UA: objectProperty("navigator", "userAgent")
};

module.exports = createConstantMacro(data);
