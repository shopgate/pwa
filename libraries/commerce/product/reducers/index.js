import { combineReducers } from 'redux';
import productsById from './productsById';
import imagesByProductId from './imagesByProductId';
import descriptionsByProductId from './descriptionsByProductId';
import propertiesByProductId from './propertiesByProductId';
import shippingByProductId from './shippingByProductId';
import variantsByProductId from './variantsByProductId';
import optionsByProductId from './optionsByProductId';
import resultsByHash from './resultsByHash';
import productRelationsByHash from './productRelationsByHash';
import mediaByProductId from './mediaByProductId';

export default combineReducers({
  descriptionsByProductId,
  imagesByProductId,
  optionsByProductId,
  productRelationsByHash,
  productsById,
  propertiesByProductId,
  resultsByHash,
  shippingByProductId,
  variantsByProductId,
  mediaByProductId,
});
