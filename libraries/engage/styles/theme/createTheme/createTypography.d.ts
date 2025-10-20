import * as React from 'react';
import { type CSSObject } from 'tss-react';
import { type Palette } from './createPalette';


export type Variant =
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
  | 'overline';

export interface FontStyle
  extends Required<{
    fontFamily: React.CSSProperties['fontFamily'];
    fontSize: number;
    fontWeightLight: React.CSSProperties['fontWeight'];
    fontWeightRegular: React.CSSProperties['fontWeight'];
    fontWeightMedium: React.CSSProperties['fontWeight'];
    fontWeightBold: React.CSSProperties['fontWeight'];
  }> {}

export interface FontStyleOptions extends Partial<FontStyle> {
  allVariants?: React.CSSProperties;
}

export type TypographyStyle = CSSObject;
export interface TypographyStyleOptions extends TypographyStyle {}

export interface TypographyUtils {
  /**
   * Calculates a rem value for a passed pixel value.
   * @param size The source value in pixels.
   * @returns The result value in rem.
   */
  pxToRem: (px: number) => string;
}

export interface Typography extends Record<Variant, TypographyStyle>, FontStyle, TypographyUtils {}

export interface TypographyOptions
  extends Partial<Record<Variant, TypographyStyleOptions> & FontStyleOptions> {}

export default function createTypography(
  palette: Palette,
  typography: TypographyOptions | ((palette: Palette) => TypographyOptions)
): Typography;
