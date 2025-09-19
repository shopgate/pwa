import * as React from 'react';
import { Variant as ThemeVariant } from '../../styles/theme/createTheme/createTypography';

type Variant = ThemeVariant | 'srOnly';

export type TypographyClassKey =
  | 'root'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button'
  | 'overline'
  | 'srOnly'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'noWrap'
  | 'gutterBottom'
  | 'paragraph'
  | 'colorInherit'
  | 'colorPrimary'
  | 'colorSecondary'
  | 'colorTextPrimary'
  | 'colorTextSecondary'
  | 'colorTextTertiary'
  | 'colorError'
  | 'colorWarning'
  | 'colorSuccess'
  | 'displayInline'
  | 'displayBlock';

/**
 * Props for the polymorphic Typography component.
 *
 * @template C - the element or component type to render (defaults to 'span')
 */
export type TypographyProps<
  C extends React.ElementType = 'span'
> = {
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
    | 'textTertiary'
    | 'error'
    | 'warning'
    | 'success';
  /**
   * Controls the display type
   * @default "initial"
   */
  display?: 'initial' | 'block' | 'inline';
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
   * 	If true, the text will have a bottom margin.
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
  variantMapping?: Partial<Record<Variant, string>>;
  /**
   * Additional CSS class names to apply to the root element.
   */
  className?: string;
  /**
   * Override specific variant styles
   */
  classes?: Partial<Record<TypographyClassKey, string>>;
  /**
   * Content to render inside the component
   */
  children?: React.ReactNode;
  /**
   * Element type or custom component to render
   * @internal
   */
  as?: C;
} & Omit<React.ComponentPropsWithRef<C>, 'children' | 'as' | 'component'>;

/**
 * The Typography component is used to render text with various styles and alignments.
 * It uses the theme's typography styles and can be customized with props.
 */
export declare const Typography: <
  C extends React.ElementType = 'span'
>(
  props: TypographyProps<C> & { ref?: React.ComponentPropsWithRef<C>['ref'] }
) => React.ReactElement | null;

export default Typography;
