import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { EEXIST } from '@shopgate/pwa-core/constants/Pipeline';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import * as pipelines from '../constants/Pipelines';
import requestSubmitReview from '../action-creators/requestSubmitReview';
import receiveSubmitReview from '../action-creators/receiveSubmitReview';
import errorSubmitReview from '../action-creators/errorSubmitReview';
import resetSubmittedReview from '../action-creators/resetSubmittedReview';
import { getUserReviewForProduct } from '../selectors/index';
import fetchProduct from '../../product/actions/fetchProduct';

/**
 * Request a user review for a product from server.
 * @param {Object} review The review data.
 * @param {boolean} update Indicate whether the update pipeline be called or not.
 * @returns {Function} The dispatched action.
 */
const submitReview = (review, update = false) => (dispatch, getState) => {
  const newReview = review;
  const originalReview = getUserReviewForProduct(getState(), { productId: review.productId });
  const fields = ['rate', 'title', 'review', 'author', 'productId'];
  const pipelineData = {};

  // Sanitize pipeline input
  Object.keys(newReview).forEach((field) => {
    if (typeof newReview[field] === 'string') {
      newReview[field] = newReview[field].trim();
    }

    if (fields.indexOf(field) !== -1) {
      pipelineData[field] = newReview[field];
    }
  });

  dispatch(requestSubmitReview(review));

  if (update) {
    const request = new PipelineRequest(pipelines.SHOPGATE_CATALOG_UPDATE_PRODUCT_REVIEW)
      .setInput(pipelineData)
      .setRetries(0)
      .dispatch();

    request
      .then(() => {
        dispatch(receiveSubmitReview(newReview));
        dispatch(fetchProduct(newReview.productId, true));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(resetSubmittedReview(originalReview));
      });

    return request;
  }

  const request = new PipelineRequest(pipelines.SHOPGATE_CATALOG_ADD_PRODUCT_REVIEW)
    .setRetries(0)
    .setErrorBlacklist([EEXIST])
    .setInput(pipelineData)
    .dispatch();

  request
    .then(() => {
      dispatch(receiveSubmitReview(newReview));
      dispatch(fetchProduct(newReview.productId, true));
    })
    .catch((error) => {
      if (error.code === EEXIST) {
        dispatch(showModal({
          confirm: null,
          title: 'modal.title_error',
          message: 'modal.body_error',
        }));
      }
      logger.error(error);
      dispatch(errorSubmitReview(newReview.productId));
    });

  return request;
};

export default submitReview;
