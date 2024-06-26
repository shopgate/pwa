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
export * from './constants';

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

// COMPONENTS
export { default as ProductProperties } from './components/ProductProperties/ProductProperties';
export { default as MapPriceHint } from './components/MapPriceHint';
export { default as OrderQuantityHint } from './components/OrderQuantityHint';
export { default as ProductImage } from './components/ProductImage';
export { default as MediaSlider } from './components/MediaSlider';
export { default as QuantityPicker } from './components/QuantityPicker';
export { default as EffectivityDates } from './components/EffectivityDates';
export { default as PriceDifference } from './components/PriceDifference';
export { FeaturedMedia, MediaImage } from './components/Media';
export { VariantSwatch } from './components/Swatch';
export { Swatches } from './components/Swatches';
export { RelationsSlider } from './components/RelationsSlider';
export { default as ProductCard } from './components/ProductCard';
export { default as ProductGridPrice } from './components/ProductGridPrice';
export { default as ProductCharacteristics } from './components/ProductCharacteristics';
export { default as Description } from './components/Description';
export { default as ProductList } from './components/ProductList';
export { default as ProductSlider } from './components/ProductSlider';
export { default as Options } from './components/Options';
export { default as Characteristics } from './components/Characteristics';
export { default as Rating } from './components/Rating';
export { default as ProductProvider } from './components/ProductProvider';
export { default as ProductBadges } from './components/ProductBadges';

// HOCs
export { default as withPriceCalculation } from './hocs/withPriceCalculation';
export { default as withProductStock } from './hocs/withProductStock';
export { default as withProductListType } from './hocs/withProductListType';
export { default as withProductListEntry } from './hocs/withProductListEntry';

// HOOKs
export { useLoadProductImage } from './hooks/useLoadProductImage';
export { default as useProductListType } from './hooks/useProductListType';
export { default as useProductListEntry } from './hooks/useProductListEntry';

// CONTEXTS
export { default as VariantContext } from './components/ProductCharacteristics/context';
export { ProductContext } from './components/context';
export { default as ProductListTypeContext } from './providers/ProductListType/context';
export { default as ProductListEntryContext } from './providers/ProductListEntry/context';

// PROVIDERS
export { default as ProductListTypeProvider } from './providers/ProductListType';
export { default as ProductListEntryProvider } from './providers/ProductListEntry';

export {
  ProductUnitQuantityPicker,
  UnitQuantityPicker,
} from './components/UnitQuantityPicker';
