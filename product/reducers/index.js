import { combineReducers } from 'redux';
import productsById from './productsById';
import imagesByProductId from './imagesByProductId';
import descriptionsByProductId from './descriptionsByProductId';
import propertiesByProductId from './propertiesByProductId';
import shippingByProductId from './shippingByProductId';
import variantsByProductId from './variantsByProductId';
import optionsByProductId from './optionsByProductId';
import resultsByHash from './resultsByHash';

export default combineReducers({
  productsById,
  imagesByProductId,
  descriptionsByProductId,
  propertiesByProductId,
  shippingByProductId,
  variantsByProductId,
  optionsByProductId,
  resultsByHash,
});
