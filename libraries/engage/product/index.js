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

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/product/constants/index';
export * from '@shopgate/pwa-common-commerce/product/constants/Pipelines';
export * from '@shopgate/pwa-common-commerce/product/constants/Portals';

// HELPERS
export * from '@shopgate/pwa-common-commerce/product/helpers';
export * from './components/Media/helpers';

// SELECTORS
export * from '@shopgate/pwa-common-commerce/product/selectors/options';
export * from '@shopgate/pwa-common-commerce/product/selectors/page';
export * from '@shopgate/pwa-common-commerce/product/selectors/price';
export * from '@shopgate/pwa-common-commerce/product/selectors/product';
export * from '@shopgate/pwa-common-commerce/product/selectors/relations';
export * from '@shopgate/pwa-common-commerce/product/selectors/variants';
export * from '@shopgate/pwa-common-commerce/product/selectors/media';
export * from './selectors/product';
export * from './selectors/price';

// STREAMS
export * from '@shopgate/pwa-common-commerce/product/streams';

// COMPONENTS
export { default as ProductProperties } from './components/ProductProperties/ProductProperties';
export { default as MapPriceHint } from './components/MapPriceHint';
export { default as OrderQuantityHint } from './components/OrderQuantityHint';
export { default as ProductImage } from './components/ProductImage';
export { default as MediaSlider } from './components/MediaSlider';
export { default as QuantityPicker } from './components/QuantityPicker';
export { default as EffectivityDates } from './components/EffectivityDates';
export { default as PriceDifference } from './components/PriceDifference';
export { FeaturedMedia } from './components/Media';
export { Swatch } from './components/Swatch';
export { Swatches } from './components/Swatches';

// HOCs
export { default as withPriceCalculation } from './hocs/withPriceCalculation';
export { default as withProductStock } from './hocs/withProductStock';
