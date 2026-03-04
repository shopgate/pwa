type OwnKeys<Derived, Base> = Exclude<keyof Derived, keyof Base>;

/**
 * OwnProps is a utility type that extracts the properties of a derived type that are not present in a base type.
 * It is useful for components that extend other components, allowing you to define the props of the derived
 * component while excluding the props of the base component.
 */
export type OwnProps<Derived, Base> = Pick<Derived, OwnKeys<Derived, Base>>;
