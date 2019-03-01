import { PipelineRequest, PROCESS_SEQUENTIAL, logger } from '@shopgate/pwa-core';
import * as pipelines from '../constants/Pipelines';
import createPipelineErrorList from '../helpers/createPipelineErrorList';
import { ECART } from '../constants/PipelineErrors';
import addCoupons from '../action-creators/addCouponsToCart';
import errorAddCouponsToCart from '../action-creators/errorAddCouponsToCart';
import successAddCouponsToCart from '../action-creators/successAddCouponsToCart';
import { messagesHaveErrors } from '../helpers';

/**
 * Adds coupons to the cart. Returns a Promise because a component waits for this action to finish.
 * @param {string[]} couponIds The IDs of the coupons that shall be added to the cart.
 * @return {Function} A redux thunk.
 */
const addCouponsToCart = couponIds => dispatch => new Promise((resolve, reject) => {
  dispatch(addCoupons(couponIds));

  const request = new PipelineRequest(pipelines.SHOPGATE_CART_ADD_COUPONS);
  request.setInput({ couponCodes: couponIds })
    .setResponseProcessed(PROCESS_SEQUENTIAL)
    .setRetries(0)
    .setErrorBlacklist(ECART)
    .dispatch()
    .then(({ messages }) => {
      /**
       * @Deprecated: The property "messages" is not supposed to be part of the pipeline response.
       * Specification demands errors to be returned as response object with an "error" property.
       * This code snippet needs to be removed after fixing the `@shopgate/legacy-cart` extension.
       */
      if (messages && messagesHaveErrors(messages)) {
        dispatch(errorAddCouponsToCart(couponIds, messages));
        reject();
        return;
      }

      dispatch(successAddCouponsToCart(couponIds));
      resolve();
    })
    .catch((error) => {
      dispatch(errorAddCouponsToCart(
        couponIds,
        createPipelineErrorList(pipelines.SHOPGATE_CART_ADD_COUPONS, error)
      ));
      logger.error(pipelines.SHOPGATE_CART_ADD_COUPONS, error);
      reject();
    });
});

export default addCouponsToCart;
