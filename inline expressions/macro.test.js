const path = require("path");
const { create } = require("babel-test");

const { fixtures } = create({
  plugins: [["macros"]],
});

fixtures("inline expressions", path.join(__dirname, "__fixtures__"));
