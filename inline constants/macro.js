//@ts-check
const { createMacro } = require("babel-plugin-macros");

module.exports = createConstantMacro;

/**
 * @param {Record<string,any>|any[]} data
 */
function createConstantMacro(data) {
  return createMacro(function Macro({ references, babel }) {
    const t = babel.types;
    Object.entries(references).forEach(([key, value]) => {
      value.forEach((ref) => {
        if (key in data) {
          const x = data[key];
          /**
           * @type {Expression}
           */
          let expression;

          switch (typeof x) {
            case "bigint":
              expression = t.bigIntLiteral(x.toString());
              break;
            case "boolean":
              expression = t.booleanLiteral(x);
              break;
            case "number":
              expression = t.numericLiteral(x);
              break;
            case "string":
              expression = t.stringLiteral(x);
              break;
            default:
              expression = t.nullLiteral();
          }

          ref.replaceWith(expression);
        }
      });
    });
  });
}

/**
 * @typedef Expression
 * @type {babel.types.Expression}
 */
