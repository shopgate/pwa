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
 * Derives the flattened component vars type from `componentsSchema`.
 *
 * Each top-level component entry is mapped to its `vars` section.
 * Leaf values become `string`.
 *
 * Example:
 * {
 *   price: {
 *     vars: {
 *       color: '';
 *     }
 *   }
 * }
 *
 * becomes:
 * {
 *   price: {
 *     color: string;
 *   }
 * }
 */
export type ComponentVarsFromSchema<TSchema> = {
  [K in keyof TSchema]:
  TSchema[K] extends { vars: infer TVars }
  ? ComponentsFromSchema<TVars>
  : never;
};

/**
 * Schema that defines the shape of the components object.
 *
 * Every mapping added to the components of createTheme should be added here to get proper typings
 * for the theme components.
 */
export const componentsSchema = {
  border: {
    vars: {
      light: '',
      medium: '',
      dark: '',
    },
  },
  price: {
    vars: {
      color: '',
    },
  },
  button: {
    vars: {
      borderRadius: '',
      color: '',
      textColor: '',
    },
  },
  input: {
    vars: {
      background: '',
      border: '',
    },
  },
  seperatorLine: {
    vars: {
      borderColor: '',
    },
  },
  ctaButton: {
    vars: {
      background: '',
      color: '',
    },
  },
  discountBadge: {
    vars: {
      background: '',
    },
  },
  snackbar: {
    vars: {
      background: '',
      contrastText: '',
    },
  },
  tabBar: {
    vars: {
      background: '',
      boxShadow: '',
      minHeight: '',
      border: '',
      inactive: '',
      active: '',
      floatingBorderRadius: '',
      floatingBoxShadow: '',
      floatingMinHeight: '',
      badgeColor: '',
      badgeBackground: '',
      badgeBorderRadius: '',
      badgeTop: '',
      badgeLeft: '',
    },
  },
  ratingStars: {
    vars: {
      filled: '',
      empty: '',
    },
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
  border: {
    vars: {
      light: '#F2F2F2',
      medium: '#b5b5b5b5',
      dark: '#747474',
    },
  },
  price: {
    vars: {
      color: t => t.palette.primary.main,
    },
  },
  input: {
    vars: {
      background: '#F2F2F2',
      border: '#CCCCCC',
    },
  },
  seperatorLine: {
    vars: {
      borderColor: '#EBEBEF',
    },
  },
  ctaButton: {
    vars: {
      background: t => t.palette.primary.main,
      color: t => t.palette.primary.contrastText,
    },
  },
  discountBadge: {
    vars: {
      background: '#857500',
    },
  },
  snackbar: {
    vars: {
      background: '#323232',
    },
  },
  tabBar: {
    vars: {
      background: '#FFFFFF',
      boxShadow: '0 -1px 0 0 rgba(0, 0, 0, 0.1)',
      minHeight: '0px',
      border: '#E6E6E6',
      inactive: '#747474)',
      active: t => t.palette.secondary.main,
      floatingBorderRadius: '16px',
      floatingBoxShadow: '0 0 12px rgba(0, 0, 0, 0.24)',
      floatingMinHeight: '59px',
      badgeColor: ' #FFFFFF)',
      badgeBackground: t => t.palette.secondary.main,
      badgeBorderRadius: '8px',
      badgeTop: '-8px',
      badgeLeft: 'calc(50% + 20px)',
    },
  },
  ratingStars: {
    vars: {
      filled: t => t.palette.primary.main,
      empty: '#CCCCCC',
    },
  },
} satisfies ComponentsDefaults;

/** Internal defaults type (must cover full schema). */
export type ComponentsDefaults =
  ComponentsOverrideFromSchema<typeof componentsSchema, Theme>;

// The components options type represents the components input that can be provided to createTheme
export type ComponentsOptions =
  ComponentsOverrideFromSchema<typeof componentsSchema, Theme>;

// The components type represents the components after theme creation
export type Components = ComponentsFromSchema<typeof componentsSchema>;

export type ComponentVars = ComponentVarsFromSchema<typeof componentsSchema>;
