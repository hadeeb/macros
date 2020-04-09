const createMacro = require("../../macro");

module.exports = createMacro({
  DEV: '"production" !== process.env.NODE_ENV',
  isDevelopment: '"production" !== process.env.NODE_ENV',
  isBrowser: '"undefined" !== typeof window',
});
