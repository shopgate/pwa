/** @module product */

// ACTION-CREATORS
export { default as productNotAvailable } from '@shopgate/pwa-common-commerce/product/action-creators/productNotAvailable';

// ACTIONS
export { default as changeSortOrder } from '@shopgate/pwa-common-commerce/product/actions/changeSortOrder';
export { default as fetchHighlightProducts } from '@shopgate/pwa-common-commerce/product/actions/fetchHighlightProducts';
export { default as fetchLiveshoppingProducts } from '@shopgate/pwa-common-commerce/product/actions/fetchLiveshoppingProducts';
export { default as fetchProduct } from '@shopgate/pwa-common-commerce/product/actions/fetchProduct';
export { default as fetchProductDescription } from '@shopgate/pwa-common-commerce/product/actions/fetchProductDescription';
export { default as fetchProductImages } from '@shopgate/pwa-common-commerce/product/actions/fetchProductImages';
export { default as fetchProductOptions } from '@shopgate/pwa-common-commerce/product/actions/fetchProductOptions';
export { default as fetchProductProperties } from '@shopgate/pwa-common-commerce/product/actions/fetchProductProperties';
export { default as fetchProductRelations } from '@shopgate/pwa-common-commerce/product/actions/fetchProductRelations';
export { default as fetchProducts } from '@shopgate/pwa-common-commerce/product/actions/fetchProducts';
export { default as fetchProductsById } from '@shopgate/pwa-common-commerce/product/actions/fetchProductsById';
export { default as fetchProductsByQuery } from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
export { default as fetchProductShipping } from '@shopgate/pwa-common-commerce/product/actions/fetchProductShipping';
export { default as fetchProductVariants } from '@shopgate/pwa-common-commerce/product/actions/fetchProductVariants';

// COLLECTIONS
export { default as productImageFormats } from '@shopgate/pwa-common-commerce/product/collections/ProductImageFormats';

// HELPERS
export * from '@shopgate/pwa-common-commerce/product/helpers';
export * from './helpers/index';
export * from './helpers/redirects';
export * from './components/Media/helpers';

// SELECTORS
export * from '@shopgate/pwa-common-commerce/product/selectors/options';
export * from '@shopgate/pwa-common-commerce/product/selectors/page';
export * from '@shopgate/pwa-common-commerce/product/selectors/price';
export * from '@shopgate/pwa-common-commerce/product/selectors/product';
export * from '@shopgate/pwa-common-commerce/product/selectors/relations';
export * from '@shopgate/pwa-common-commerce/product/selectors/variants';
export * from './selectors/media';
export {
  getProductIsFetching,
  makeGetProductProperties,
  makeGetProductEffectivityDates,
  makeGetProductCharacteristics,
  makeGetProductFeaturedMedia,
  makeIsProductActive,
  makeIsBaseProductActive,
  makeGetProductType,
} from './selectors/product';
export * from './selectors/price';
export * from './selectors/variants';
export * from './selectors/relations';

// STREAMS
export * from '@shopgate/pwa-common-commerce/product/streams';

// HOCs
export { default as withPriceCalculation } from './hocs/withPriceCalculation';
export { default as withProductStock } from './hocs/withProductStock';
export { default as withProduct } from './hocs/withProduct';
export { default as withProductListType } from './hocs/withProductListType';
export { default as withProductListEntry } from './hocs/withProductListEntry';

// HOOKs
export { useLoadProductImage } from './hooks/useLoadProductImage';
export { default as useProductListType } from './hooks/useProductListType';
export { default as useProductListEntry } from './hooks/useProductListEntry';

// CONTEXTS
export { ProductContext, VariantContext } from './components/context';
export { default as ProductListTypeContext } from './providers/ProductListType/context';
export { default as ProductListEntryContext } from './providers/ProductListEntry/context';

export * from './constants';
export * from './components';
export * from './providers';
