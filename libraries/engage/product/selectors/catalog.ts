import {
  getBaseProductId as getBaseProductIdSelector,
  getProduct as getProductSelector,
  getProductVariants as getProductVariantsSelector,
  getProductVariantsState as getProductVariantsStateSelector,
  hasProductVariants as hasProductVariantsSelector,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import type { ProductVariants } from '../components/VariantSelector/types';

interface ProductProps {
  productId: string | null;
}

/** The fields of a catalog product that the variant selection, quick add and share use. */
export interface CatalogProduct {
  id: string;
  name?: string;
  active?: boolean;
  productUrl?: string;
  featuredImageUrl?: string;
  featuredImageBaseUrl?: string;
  flags?: { hasVariants?: boolean; hasOptions?: boolean } | null;
  stock?: { orderable?: boolean; quantity?: number; ignoreQuantity?: boolean } | null;
  price?: {
    currency: string;
    unitPrice: number;
    unitPriceStriked?: number | null;
    msrp?: number | null;
  } | null;
  fulfillmentMethods?: string[] | null;
}

type ProductSelector<T> = (state: unknown, props: ProductProps) => T;

export const getProduct = getProductSelector as unknown as ProductSelector<CatalogProduct | null>;

export const getProductVariants = getProductVariantsSelector as unknown as ProductSelector<
  ProductVariants | null
>;

export const hasProductVariants = hasProductVariantsSelector as unknown as ProductSelector<
  boolean | null
>;

export const getBaseProductId = getBaseProductIdSelector as unknown as ProductSelector<
  string | null
>;

export const getProductVariantsState = getProductVariantsStateSelector as unknown as (
  state: unknown
) => Record<string, { isFetching?: boolean } | undefined>;
