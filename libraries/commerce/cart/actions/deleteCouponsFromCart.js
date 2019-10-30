import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { logger } from '@shopgate/pwa-core/helpers';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CART_DELETE_COUPONS } from '../constants/Pipelines';
import createPipelineErrorList from '../helpers/createPipelineErrorList';
import { ECART } from '../constants/PipelineErrors';
import deleteCoupons from '../action-creators/deleteCouponsFromCart';
import errorDeleteCouponsFromCart from '../action-creators/errorDeleteCouponsFromCart';
import successDeleteCouponsFromCart from '../action-creators/successDeleteCouponsFromCart';
import { messagesHaveErrors } from '../helpers';

/**
 * Deletes coupons from the cart.
 * @param {string[]} couponIds The IDs of the coupons that shall be deleted from the cart.
 * @return {Function} A redux thunk.
 */
function deleteCouponsFromCart(couponIds) {
  return (dispatch) => {
    dispatch(deleteCoupons(couponIds));

    return new PipelineRequest(SHOPGATE_CART_DELETE_COUPONS)
      .setInput({ couponCodes: couponIds })
      .setResponseProcessed(PROCESS_SEQUENTIAL)
      .setErrorBlacklist(ECART)
      .dispatch()
      .then((result) => {
        /**
         * @deprecated: The property "messages" is not supposed to be part of the pipeline response.
         * Specification demands errors to be returned as response object with an "error" property.
         * This code snippet needs to be removed after fixing the `@shopgate/legacy-cart` extension.
         */
        if (result.messages && messagesHaveErrors(result.messages)) {
          dispatch(errorDeleteCouponsFromCart(couponIds, result.messages));
          return result;
        }

        dispatch(successDeleteCouponsFromCart());
        return result;
      })
      .catch((error) => {
        dispatch(errorDeleteCouponsFromCart(
          couponIds,
          createPipelineErrorList(SHOPGATE_CART_DELETE_COUPONS, error)
        ));
        logger.error(SHOPGATE_CART_DELETE_COUPONS, error);
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(deleteCouponsFromCart);
