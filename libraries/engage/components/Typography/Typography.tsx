import * as React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import type { Variant as ThemeVariant } from '../../styles/theme/createTheme/createTypography';

type Variant = ThemeVariant | 'srOnly';

/**
 * Named font weights mapped to the theme's `fontWeight*` tokens.
 */
export type FontWeight = 'light' | 'regular' | 'medium' | 'bold';

/**
 * Capitalizes the first letter of a string while preserving its literal type.
 * @param string The string to capitalize.
 * @returns The string with the first letter capitalized.
 */
const capitalize = <T extends string>(string: T): Capitalize<T> =>
  (string.charAt(0).toUpperCase() + string.slice(1)) as Capitalize<T>;

const useStyles = makeStyles({
  name: 'Typography',
})(theme => ({
  /* Styles applied to the root element. */
  root: {
    margin: 0,
  },
  /* Styles applied to the root element if `nowrap={true}`. */
  noWrap: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  /* Styles applied to the root element if `gutterBottom={true}`. */
  gutterBottom: {
    marginBottom: '0.35em',
  },
  /* Styles applied to the root element if `paragraph={true}`. */
  paragraph: {
    marginBottom: 16,
  },
  /*
   * The classes below are applied through props via dynamic keys (e.g. `classes[variant]`,
   * `classes[`color${capitalize(color)}`]`), which the linter cannot trace statically.
   */
  /* eslint-disable tss-unused-classes/unused-classes */
  /* Styles applied to the root element if `variant="body2"`. */
  body2: theme.typography.body2,
  /* Styles applied to the root element if `variant="body1"`. */
  body1: theme.typography.body1,
  /* Styles applied to the root element if `variant="caption"`. */
  caption: theme.typography.caption,
  /* Styles applied to the root element if `variant="button"`. */
  button: theme.typography.button,
  /* Styles applied to the root element if `variant="h1"`. */
  h1: theme.typography.h1,
  /* Styles applied to the root element if `variant="h2"`. */
  h2: theme.typography.h2,
  /* Styles applied to the root element if `variant="h3"`. */
  h3: theme.typography.h3,
  /* Styles applied to the root element if `variant="h4"`. */
  h4: theme.typography.h4,
  /* Styles applied to the root element if `variant="h5"`. */
  h5: theme.typography.h5,
  /* Styles applied to the root element if `variant="h6"`. */
  h6: theme.typography.h6,
  /* Styles applied to the root element if `variant="subtitle1"`. */
  subtitle1: theme.typography.subtitle1,
  /* Styles applied to the root element if `variant="subtitle2"`. */
  subtitle2: theme.typography.subtitle2,
  /* Styles applied to the root element if `variant="overline"`. */
  overline: theme.typography.overline,
  /* Styles applied to the root element if `variant="srOnly"`. Only accessible to screen readers. */
  srOnly: {
    position: 'absolute',
    height: 1,
    width: 1,
    overflow: 'hidden',
  },
  /* Styles applied to the root element if `align="left"`. */
  alignLeft: {
    textAlign: 'left',
  },
  /* Styles applied to the root element if `align="center"`. */
  alignCenter: {
    textAlign: 'center',
  },
  /* Styles applied to the root element if `align="right"`. */
  alignRight: {
    textAlign: 'right',
  },
  /* Styles applied to the root element if `align="justify"`. */
  alignJustify: {
    textAlign: 'justify',
  },
  /* Styles applied to the root element if `color="inherit"`. */
  colorInherit: {
    color: 'inherit',
  },
  /* Styles applied to the root element if `color="primary"`. */
  colorPrimary: {
    color: theme.palette.primary.main,
  },
  /* Styles applied to the root element if `color="secondary"`. */
  colorSecondary: {
    color: theme.palette.secondary.main,
  },
  /* Styles applied to the root element if `color="textPrimary"`. */
  colorTextPrimary: {
    color: theme.palette.text.primary,
  },
  /* Styles applied to the root element if `color="textSecondary"`. */
  colorTextSecondary: {
    color: theme.palette.text.secondary,
  },
  /* Styles applied to the root element if `color="error"`. */
  colorError: {
    color: theme.palette.error.main,
  },
  /* Styles applied to the root element if `color="warning"` */
  colorWarning: {
    color: theme.palette.warning.main,
  },
  /* Styles applied to the root element if `color="success"` */
  colorSuccess: {
    color: theme.palette.success.main,
  },
  /* Styles applied to the root element if `display="inline"`. */
  displayInline: {
    display: 'inline',
  },
  /* Styles applied to the root element if `display="block"`. */
  displayBlock: {
    display: 'block',
  },
  /* Styles applied to the root element if `fontWeight="light"`. */
  fontWeightLight: {
    fontWeight: theme.typography.fontWeightLight,
  },
  /* Styles applied to the root element if `fontWeight="regular"`. */
  fontWeightRegular: {
    fontWeight: theme.typography.fontWeightRegular,
  },
  /* Styles applied to the root element if `fontWeight="medium"`. */
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  /* Styles applied to the root element if `fontWeight="bold"`. */
  fontWeightBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  /* eslint-enable tss-unused-classes/unused-classes */
}));

const defaultVariantMapping: Partial<Record<Variant, React.ElementType>> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
};

/**
 * Own props of the polymorphic Typography component.
 *
 * @template C - the element or component type to render (defaults to 'span')
 */
export type TypographyOwnProps<C extends React.ElementType = 'span'> = {
  /**
   * Set the text-align on the component.
   * @default "inherit"
   */
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  color?:
    | 'initial'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error'
    | 'warning'
    | 'success';
  /**
   * Controls the display type
   * @default "initial"
   */
  display?: 'initial' | 'block' | 'inline';
  /**
   * Overrides the font weight defined by the variant, using the theme's font weight tokens.
   */
  fontWeight?: FontWeight;
  /**
   * If `true`, the text will have a bottom margin.
   * @default false
   */
  gutterBottom?: boolean;
  /**
   * If true, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   * Note that text overflow can only happen with block or inline-block level elements
   * (the element needs to have a width in order to overflow).
   * @default false
   */
  noWrap?: boolean;
  /**
   * If true, the text will have a bottom margin.
   * @default false
   */
  paragraph?: boolean;
  /**
   * Applies the theme typography styles.
   * @default "body1"
   */
  variant?: Variant | 'inherit';
  /**
   * The component used for the root node. Either a string to use a HTML element or a component.
   * Overrides the behavior of the variantMapping prop.
   */
  component?: C;
  /**
   * The component maps the variant prop to a range of different HTML element types.
   * For instance, subtitle1 to <h6>. If you wish to change that mapping, you can provide your own.
   * Alternatively, you can use the component prop.
   */
  variantMapping?: Partial<Record<Variant, React.ElementType>>;
  /**
   * Additional CSS class names to apply to the root element.
   */
  className?: string;
  /**
   * Override specific variant styles
   */
  classes?: Partial<ReturnType<typeof useStyles>['classes']>;
  /**
   * Content to render inside the component
   */
  children?: React.ReactNode;
};

/**
 * Props for the polymorphic Typography component, merged with the props of the
 * underlying element or component.
 *
 * @template C - the element or component type to render (defaults to 'span')
 */
export type TypographyProps<C extends React.ElementType = 'span'> =
  TypographyOwnProps<C> &
  Omit<React.ComponentPropsWithRef<C>, keyof TypographyOwnProps<C>>;

/**
 * The Typography component is used to render text with various styles and alignments.
 * It uses the theme's typography styles and can be customized with props.
 */
function Typography<C extends React.ElementType = 'span'>(
  props: TypographyProps<C>,
  ref: React.Ref<Element>
) {
  const {
    align = 'inherit',
    className,
    classes: classesOverrides,
    color = 'initial',
    component,
    display = 'initial',
    fontWeight,
    gutterBottom = false,
    noWrap = false,
    paragraph = false,
    variant = 'body1',
    variantMapping = defaultVariantMapping,
    ...other
  } = props;

  const { classes, cx } = useStyles(undefined, {
    props: { classes: classesOverrides },
  });

  const mappedComponent =
    variant !== 'inherit'
      ? variantMapping[variant] ?? defaultVariantMapping[variant]
      : undefined;

  const Component: React.ElementType =
    component || (paragraph ? 'p' : mappedComponent) || 'span';

  return (
    <Component
      className={cx(
        classes.root,
        'engage__typography',
        variant !== 'inherit' && classes[variant],
        color !== 'initial' && classes[`color${capitalize(color)}`],
        align !== 'inherit' && classes[`align${capitalize(align)}`],
        display !== 'initial' && classes[`display${capitalize(display)}`],
        fontWeight && classes[`fontWeight${capitalize(fontWeight)}`],
        {
          [`engage__typography_${variant}`]: variant !== 'inherit',
          [classes.noWrap]: noWrap,
          [classes.gutterBottom]: gutterBottom,
          'engage__typography__gutter-bottom': gutterBottom,
          [classes.paragraph]: paragraph,
          engage__typography__paragraph: paragraph,
        },
        className
      )}
      ref={ref}
      {...other}
    />
  );
}

export default React.forwardRef(Typography) as <
  C extends React.ElementType = 'span'
>(
  props: TypographyProps<C> & { ref?: React.ComponentPropsWithRef<C>['ref'] }
) => React.ReactElement | null;
