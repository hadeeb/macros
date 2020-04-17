//@ts-check
const { createMacro } = require("babel-plugin-macros");

module.exports = createConstantMacro;

/**
 * @param {Record<string,string>} data
 */
function createConstantMacro(data) {
  return createMacro(function Macro({ references, babel }) {
    const createExpression = babel.template.expression.ast;

    for (let key in references) {
      const refs = references[key];
      if (key in data) {
        const str = data[key];

        const expression = createExpression(str, {
          placeholderPattern: false,
        });

        refs.forEach((ref) => {
          ref.replaceWith(expression);
        });
      }
    }
  });
}

/**
 * @typedef Expression
 * @type {babel.types.Expression}
 */
