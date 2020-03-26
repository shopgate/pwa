/* eslint-disable require-jsdoc */
import { mockedProducts } from '@shopgate/pwa-common-commerce/product/mock';

export const ProductProperties = () => 'ProductProperties';
export const RelationsSlider = () => 'RelationsSlider';
export const Description = () => 'Description';

export { ProductContext, VariantContext } from '../components/context';

// SELECTORS
export const getProductDataById = jest.fn().mockReturnValue(mockedProducts.products[0]);

/* eslint-enable require-jsdoc */
