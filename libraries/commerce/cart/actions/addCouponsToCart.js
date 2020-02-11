import { PipelineRequest, PROCESS_SEQUENTIAL } from '@shopgate/pwa-core';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CART_ADD_COUPONS } from '../constants/Pipelines';
import createPipelineErrorList from '../helpers/createPipelineErrorList';
import { ECART } from '../constants/PipelineErrors';
import addCoupons from '../action-creators/addCouponsToCart';
import errorAddCouponsToCart from '../action-creators/errorAddCouponsToCart';
import successAddCouponsToCart from '../action-creators/successAddCouponsToCart';
import { messagesHaveErrors } from '../helpers';
import { MESSAGE_TYPE_ERROR } from '../constants';

/**
 * Adds coupons to the cart. Returns a Promise because a component waits for this action to finish.
 * @param {string[]} couponIds The IDs of the coupons that shall be added to the cart.
 * @return {Function} A redux thunk.
 */
function addCouponsToCart(couponIds) {
  return (dispatch) => {
    dispatch(addCoupons(couponIds));

    const request = new PipelineRequest(SHOPGATE_CART_ADD_COUPONS)
      .setInput({ couponCodes: couponIds })
      .setResponseProcessed(PROCESS_SEQUENTIAL)
      .setRetries(0)
      .setErrorBlacklist(ECART)
      .dispatch();

    request
      .then((result) => {
        /**
         * @deprecated: The property "messages" is not supposed to be part of the pipeline response.
         * Specification demands errors to be returned as response object with an "error" property.
         * This code snippet needs to be removed after fixing the `@shopgate/legacy-cart` extension.
         */
        if (result.messages && messagesHaveErrors(result.messages)) {
          // Simulate a pipeline response error with a proper ECART error.
          const errors = result.messages.filter(msg => msg.type === MESSAGE_TYPE_ERROR);
          const error = {
            ...errors[0],
            code: ECART,
            message: '', // Irrelevant in this case
            errors,
          };
          dispatch(errorAddCouponsToCart(
            couponIds,
            createPipelineErrorList(SHOPGATE_CART_ADD_COUPONS, error)
          ));
          return;
        }

        dispatch(successAddCouponsToCart(couponIds));
      })
      .catch((error) => {
        dispatch(errorAddCouponsToCart(
          couponIds,
          createPipelineErrorList(SHOPGATE_CART_ADD_COUPONS, error)
        ));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(addCouponsToCart);
