declare function createConstantMacro<T>(data: T): T;
declare function objectProperty<T = string>(
  objectName: string,
  propertyName: string
): T;

export = {
  createConstantMacro,
  objectProperty
};
