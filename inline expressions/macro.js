//@ts-check
const { createMacro } = require("babel-plugin-macros");

module.exports = createConstantMacro;

function createConstantMacro(data) {
  return createMacro(function Macro({ references, babel }) {
    const t = babel.types;
    const templ = babel.template;

    Object.entries(references).forEach(([key, value]) => {
      value.forEach((ref) => {
        if (key in data) {
          const str = data[key];
          const template = templ(str, {
            placeholderPattern: false,
          });

          /**
           * @type {Expression}
           */
          // @ts-ignore
          const expression = template().expression;

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
