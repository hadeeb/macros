declare const id: unique symbol;
type PropertyAccess<T> = T & { [id]: unknown };

type ValidValues = bigint | number | boolean | string | null;

declare function createConstantMacro<
  T extends Record<string, ValidValues | PropertyAccess<ValidValues>>
>(data: T): T;

declare function objectProperty<T extends ValidValues = string>(
  objectName: string | PropertyAccess<string>,
  propertyName: string
): PropertyAccess<T>;

declare const exported = {
  createConstantMacro,
  objectProperty
};

export = exported;

export default exported;
