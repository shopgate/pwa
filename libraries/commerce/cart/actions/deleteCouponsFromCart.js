import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { logger } from '@shopgate/pwa-core/helpers';
import * as pipelines from '../constants/Pipelines';
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
const deleteCouponsFromCart = couponIds => (dispatch) => {
  dispatch(deleteCoupons(couponIds));

  const request = new PipelineRequest(pipelines.SHOPGATE_CART_DELETE_COUPONS);
  request.setInput({ couponCodes: couponIds })
    .setResponseProcessed(PROCESS_SEQUENTIAL)
    .setErrorBlacklist(ECART)
    .dispatch()
    .then(({ messages }) => {
      /**
       * @Deprecated: The property "messages" is not supposed to be part of the pipeline response.
       * Specification demands errors to be returned as response object with an "error" property.
       * This code snippet needs to be removed after fixing the `@shopgate/legacy-cart` extension.
       */
      if (messages && messagesHaveErrors(messages)) {
        dispatch(errorDeleteCouponsFromCart(couponIds, messages));
        return;
      }

      dispatch(successDeleteCouponsFromCart());
    })
    .catch((error) => {
      dispatch(errorDeleteCouponsFromCart(
        couponIds,
        createPipelineErrorList(pipelines.SHOPGATE_CART_DELETE_COUPONS, error)
      ));
      logger.error(pipelines.SHOPGATE_CART_DELETE_COUPONS, error);
    });
};

export default deleteCouponsFromCart;
