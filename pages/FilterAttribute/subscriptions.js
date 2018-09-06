import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { attributeWillEnter$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { getCurrentFilterAttribute } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * @param {Function} subscribe Subscribes to a stream.
 */
export default function filterAttribute(subscribe) {
  subscribe(attributeWillEnter$, ({ dispatch, action, getState }) => {
    const { attribute } = action.route.params;

    if (!attribute) {
      return;
    }

    const url = `${FILTER_PATH}/${attribute}`;
    const filter = getCurrentFilterAttribute(getState(), { url });

    if (filter) {
      dispatch(setTitle(filter.label));
    }
  });
}
