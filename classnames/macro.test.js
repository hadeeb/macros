const path = require("path");
const { create } = require("babel-test");

const { fixtures } = create({
  plugins: [["macros"]],
});

fixtures("classnames", path.join(__dirname, "__fixtures__"));
