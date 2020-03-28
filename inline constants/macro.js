//@ts-check
const { createMacro } = require("babel-plugin-macros");
const { types } = require("@babel/core");

module.exports = { createConstantMacro, objectProperty };

/**
 * @param {Record<string,any>|any[]} data
 */
function createConstantMacro(data) {
  return createMacro(function Macro({ references, babel }) {
    const t = babel.types;
    Object.entries(references).forEach(([key, value]) => {
      value.forEach(ref => {
        if (key in data) {
          const x = data[key];
          /**
           * @type {babel.types.Expression}
           */
          let expression;

          if (t.isExpression(x)) {
            expression = x;
          } else {
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
          }

          ref.replaceWith(expression);
        }
      });
    });
  });
}

/**
 * @param {string|Expression} objectName
 * @param {string} propertyName
 */
function objectProperty(objectName, propertyName) {
  return types.memberExpression(
    typeof objectName === "string" ? types.identifier(objectName) : objectName,
    types.identifier(propertyName)
  );
}

/**
 * @typedef Expression
 * @type {babel.types.Expression}
 */
