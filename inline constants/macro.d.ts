type ValidValues = bigint | number | boolean | string | null;

declare function createConstantMacro<T extends Record<string, ValidValues>>(
  data: T
): T;

export = createConstantMacro;
