/* eslint require-jsdoc: "off" */
import { mockedProducts } from '@shopgate/pwa-common-commerce/product/mock';
import { withWidgetSettings } from '@shopgate/engage/core/hocs';

export const ProductProperties = () => 'ProductProperties';
export const RelationsSlider = () => 'RelationsSlider';
export const Description = () => 'Description';

export const ProductImagePure = () => null;
export const ProductImage = withWidgetSettings(ProductImagePure, '@shopgate/engage/product/ProductImage');

export { ProductContext, VariantContext } from '../components/context';

// SELECTORS
export const getProductDataById = jest.fn().mockReturnValue(mockedProducts.products[0]);

export const productImageFormats = new Map();
export const enableRedirectHandler = jest.fn();
export const setDefaultProductFetchParams = jest.fn();
export const getProductImageSettings = jest.fn().mockReturnValue({});
export const ITEM_PATH = 'ITEM_PATH';

