import { button } from '../../../locations/components/ReserveForm/ReserveForm.style';
import type { BaseTheme } from './index';

type Theme = Omit<BaseTheme, 'components'>;

/**
 * Leaf placeholders used in schemas.
 * (Schema values are placeholders; only keys matter.)
 */
type Leaf = string | number | boolean | null | undefined;

/**
 * Represents a component token value used during theme creation.
 *
 * A token can be provided as:
 * - a `string` (direct value), or
 * - a function that derives the value from theme tokens (e.g. palette).
 *
 * This enables component defaults / overrides like:
 * - `{ color: '#111' }`
 * - `{ color: (theme) => theme.palette.text.primary }`
 */
export type ComponentTokenValue<TTheme> =
  | string
  | number
  | ((theme: TTheme) => string | number);

/**
 * Derives the **resolved** components type from `componentsSchema`.
 *
 * Represents the components object on the final theme (e.g. via `useTheme()`),
 * where all token values are plain strings.
 *
 * Rules:
 * - Leaf values become `string`.
 * - Arrays (if present) are mapped element-by-element.
 * - Objects are recursively mapped and all keys are required.
 */
export type ComponentsFromSchema<TSchema> =
  TSchema extends Leaf ? string
  : TSchema extends readonly (infer U)[] ? readonly ComponentsFromSchema<U>[]
  : TSchema extends object ? { [K in keyof TSchema]: ComponentsFromSchema<TSchema[K]> }
  : string;

/**
 * Derives the **defaults** components type from `componentsSchema`.
 *
 * Represents the internal default token set shipped with the design system.
 * Defaults must cover the full schema (no missing keys), but each leaf can be
 * either a string or a theme-derived function.
 *
 * Rules:
 * - Leaf values become `ComponentTokenValue<TTheme>`.
 * - Arrays (if present) are mapped element-by-element.
 * - Objects are recursively mapped and all keys are required.
 */
export type ComponentsDefaultsFromSchema<TSchema, TTheme> =
  TSchema extends Leaf ? ComponentTokenValue<TTheme>
  : TSchema extends readonly (infer U)[] ? readonly ComponentsDefaultsFromSchema<U, TTheme>[]
  : TSchema extends object
    ? { [K in keyof TSchema]: ComponentsDefaultsFromSchema<TSchema[K], TTheme> }
    : ComponentTokenValue<TTheme>;

/**
 * Derives the **override** components type from `componentsSchema`.
 *
 * Represents what can be passed into `createTheme({ components: ... })`.
 * Overrides are deep-partial: users can provide any subset of tokens, while
 * still being guided by the schema for valid keys.
 *
 * Rules:
 * - Leaf values become `ComponentTokenValue<TTheme>`.
 * - Arrays (if present) are mapped element-by-element.
 * - Objects are recursively mapped and all properties are optional at every level.
 */
export type ComponentsOverrideFromSchema<TSchema, TTheme> =
  TSchema extends Leaf ? ComponentTokenValue<TTheme>
  : TSchema extends readonly (infer U)[] ? readonly ComponentsOverrideFromSchema<U, TTheme>[]
  : TSchema extends object
    ? { [K in keyof TSchema]?: ComponentsOverrideFromSchema<TSchema[K], TTheme> }
    : ComponentTokenValue<TTheme>;
/**
 * Schema that defines the shape of the components object.
 *
 * Every mapping added to the components of createTheme should be added here to get proper typings
 * for the theme components.
 */
export const componentsSchema = {
  price: {
    color: '',
  },
  button: {
    borderRadius: '',
  },
  buttonGroup: {
    borderRadius: '',
  },
} as const;

/**
 * Default component tokens.
 * Users can override any subset via `createTheme({ components: ... })`.
 *
 * `satisfies` ensures:
 * - you cover every schema entry
 * - functions get proper `Theme` typing
 */
export const componentsDefaults = {
  price: {
    color: t => t.palette.primary.main,
  },
  button: {
    borderRadius: t => t.shape.borderRadius,
  },
  buttonGroup: {
    borderRadius: t => t.shape.borderRadius,
  },
} satisfies ComponentsDefaults;

/** Internal defaults type (must cover full schema). */
export type ComponentsDefaults =
  ComponentsDefaultsFromSchema<typeof componentsSchema, Theme>;

// The components options type represents the components input that can be provided to createTheme
export type ComponentsOptions =
  ComponentsOverrideFromSchema<typeof componentsSchema, Theme>;

// The components type represents the components after theme creation
export type Components = ComponentsFromSchema<typeof componentsSchema>;

