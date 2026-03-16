type KnownKeys<T> = {
  [K in keyof T]-?: string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K;
}[keyof T];

type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
  ? true
  : false;

type IsAny<T> = 0 extends (1 & T) ? true : false;

type OwnKeys<Derived, Base> = {
  [K in KnownKeys<Derived>]-?: K extends keyof Base
    ? IsAny<Base[K]> extends true
      ? K
      : IsEqual<Derived[K], Base[K]> extends true
        ? never
        : K
    : K;
}[KnownKeys<Derived>];

/**
 * OwnProps is a utility type that extracts the properties of a derived type that are not present in a base type.
 * It is useful for components that extend other components, allowing you to define the props of the derived
 * component while excluding the props of the base component.
 */
export type OwnProps<Derived, Base> =
  Pick<Derived, OwnKeys<Derived, Base>> & Record<string, unknown>;
