//@ts-check
const { createMacro } = require("babel-plugin-macros");

module.exports = createMacro(Macro);

/**
 * @param {import("babel-plugin-macros").MacroParams} param0
 */
function Macro({ references, babel }) {
  const t = babel.types;
  const emptyString = t.stringLiteral("");
  const spacerString = t.stringLiteral(" ");

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
              dynamicPart = getValue(arg, dynamicPart);
            }
          }
        });

        const hasStatic = staticParts.length > 0;
        const hasDynamic = !!dynamicPart;

        /**
         * @type {Expression}
         */
        let replacement;

        if (hasStatic) {
          const staticStr = staticParts.join(" ") + (hasDynamic ? " " : "");
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

  /**
   * append `arg` to `result`
   * @param {Expression} arg
   * @param {Expression} result
   */
  function getValue(arg, result) {
    arg =
      t.isLogicalExpression(arg) && arg.operator === "&&"
        ? // a && b => a ? b : ""
          t.conditionalExpression(arg.left, arg.right, emptyString)
        : arg;

    // result ? result + " " + arg : arg
    return result ? createBinaryExpression(result, arg) : arg;
  }

  /**
   * `(left,right) => left + " " + right`
   * @param {Expression} left
   * @param {Expression} right
   */
  function createBinaryExpression(left, right) {
    return t.binaryExpression(
      "+",
      t.binaryExpression("+", left, spacerString),
      right
    );
  }
}

/**
 * @typedef Expression
 * @type {babel.types.Expression}
 */
