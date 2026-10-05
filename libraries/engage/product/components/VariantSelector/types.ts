import type React from 'react';

/** Selected value ID per characteristic ID. */
export type VariantSelection = Record<string, string>;

/** Swatch of a characteristic value, holds either a color or an image URL. */
export interface VariantSwatchData {
  color?: string;
  imageUrl?: string;
}

/** A value of a characteristic as delivered by the variants pipeline. */
export interface VariantCharacteristicValue {
  id: string;
  label: string;
  swatch?: VariantSwatchData;
}

/** A characteristic (e.g. color or size) as delivered by the variants pipeline. */
export interface VariantCharacteristic {
  id: string;
  label: string;
  swatch?: boolean;
  values: VariantCharacteristicValue[];
}

/** A variant product as delivered by the variants pipeline. */
export interface VariantProduct {
  id: string;
  characteristics: VariantSelection;
  availability?: { state: string; text: string } | null;
  stock?: { quantity?: number | null; ignoreQuantity?: boolean; orderable?: boolean } | null;
  featuredImageBaseUrl?: string | null;
  featuredImageUrl?: string | null;
}

/** The variants entry of a base product. */
export interface ProductVariants {
  characteristics: VariantCharacteristic[];
  products: VariantProduct[];
}

/** A value of a characteristic row with its selection state. */
export interface VariantSelectorValue extends VariantCharacteristicValue {
  selectable: boolean;
  selected: boolean;
  /** Whether every variant with this value is sold out. */
  soldOut?: boolean;
}

/** One characteristic prepared for rendering. */
export interface VariantSelectorRow {
  id: string;
  label: string;
  disabled: boolean;
  selected: string | null;
  swatch: boolean;
  values: VariantSelectorValue[];
}

/** Payload of a value selection. */
export interface VariantSelectionChange {
  id: string;
  value: string;
}

/** Props every characteristic renderer receives. */
export interface VariantRendererProps {
  charRef: React.RefObject<HTMLElement>;
  disabled: boolean;
  highlight: boolean;
  id: string;
  label: string;
  selected: string | null;
  swatch: boolean;
  values: VariantSelectorValue[];
  select: (selection: VariantSelectionChange) => void;
  resetHighlight: () => void;
  /** Layout of the chips renderer. */
  chipsLayout?: 'wrap' | 'scroll';
  /** How sold out values are marked. */
  soldOutDisplay?: 'strike' | 'hide' | 'none';
}

/** Display types for characteristics. Extensions can register further types. */
export type VariantRendererType =
  'dropdown' | 'chips' | 'swatches' | (string & NonNullable<unknown>);
