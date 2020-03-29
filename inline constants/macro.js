//@ts-check
const { createMacro } = require("babel-plugin-macros");

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

          if (isPropertyAccess(x)) {
            expression = getExpression(x);
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

    /**
     * @param {PropertyAccess} propertyAccess
     * @returns {Expression}
     */
    function getExpression(propertyAccess) {
      const obj = propertyAccess.obj;
      return t.memberExpression(
        isPropertyAccess(obj) ? getExpression(obj) : t.identifier(obj),
        t.identifier(propertyAccess.prop)
      );
    }
  });
}

const flag = {};

/**
 * @param {string|PropertyAccess} objectName
 * @param {string} propertyName
 * @returns {PropertyAccess}
 */
function objectProperty(objectName, propertyName) {
  return {
    type: flag,
    obj: objectName,
    prop: propertyName
  };
}

/**
 * @param {any} obj
 * @returns {obj is PropertyAccess}
 */
function isPropertyAccess(obj) {
  return obj && typeof obj === "object" && obj.type === flag;
}

/**
 * @typedef PropertyAccess
 * @type {object}
 * @property {typeof flag} type
 * @property {string|PropertyAccess} obj
 * @property {string} prop
 */

/**
 * @typedef Expression
 * @type {babel.types.Expression}
 */
