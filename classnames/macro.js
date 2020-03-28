//@ts-check
const { createMacro } = require("babel-plugin-macros");
const t = require("@babel/core").types;

const emptyString = t.stringLiteral("");
const spacerString = t.stringLiteral(" ");

const configName = "macros/classnames";

module.exports = createMacro(Macro, { configName });

/**
 * @param {import("babel-plugin-macros").MacroParams & {config:Config}} param0
 */
function Macro({ references, config }) {
  config = Object.assign({ loose: true }, config);

  const refs = references.default;

  if (refs) {
    refs.forEach(ref => {
      const { parent, parentPath } = ref;

      if (t.isCallExpression(parent)) {
        const args = parent.arguments;

        /**
         * @type {babel.NodePath<babel.types.Node>[]}
         */
        //@ts-ignore
        const argPaths = parentPath.get("arguments");

        /**
         * @type {string[]}
         */
        const staticParts = [];
        /**
         * @type {Expression}
         */
        let dynamicPart;

        args.forEach((arg, i) => {
          const argPath = argPaths[i];
          const res = argPath.evaluate();
          if (res.confident) {
            if (res.value) {
              staticParts.push(res.value);
            }
          } else {
            if (t.isExpression(arg)) {
              dynamicPart = getValue(arg, dynamicPart, config);
            }
          }
        });

        const hasStatic = staticParts.length > 0;
        const hasDynamic = !!dynamicPart;

        const staticStr = staticParts.join(" ") + (hasDynamic ? " " : "");

        /**
         * @type {Expression}
         */
        let replacement;

        if (hasStatic) {
          replacement = t.stringLiteral(staticStr);
        }

        if (hasDynamic) {
          if (hasStatic) {
            replacement = t.binaryExpression("+", replacement, dynamicPart);
          } else {
            replacement = dynamicPart;
          }
        }

        ref.parentPath.replaceWith(replacement || emptyString);
      }
    });
  }
}

/**
 *
 * @param {Expression} arg
 * @param {Expression} result
 * @param {Config} config
 */
function getValue(arg, result, { loose }) {
  /**
   * @type Expression
   */
  let newVal;

  switch (arg.type) {
    case "LogicalExpression": {
      if (arg.operator === "&&") {
        newVal = t.conditionalExpression(arg.left, arg.right, emptyString);
      } else {
        newVal = arg;
      }
      break;
    }
    case "ConditionalExpression": {
      newVal = arg;
      break;
    }
    default: {
      newVal = loose ? arg : t.logicalExpression("||", arg, emptyString);
    }
  }

  if (newVal) {
    if (result) {
      return createBinary(result, newVal);
    } else {
      return newVal;
    }
  }

  return result;
}

/**
 *
 * @param {Expression} left
 * @param {Expression} right
 */
function createBinary(left, right) {
  return t.binaryExpression(
    "+",
    t.binaryExpression("+", left, spacerString),
    right
  );
}

/**
 * @typedef Expression
 * @type {babel.types.Expression}
 */

/**
 * @typedef Config
 * @type {object}
 * @property {boolean} loose
 */
