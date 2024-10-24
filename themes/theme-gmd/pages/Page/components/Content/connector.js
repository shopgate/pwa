import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getIsLocationBasedShopping } from '@shopgate/engage/core/selectors';
import { PAGE_ID_INDEX } from '@shopgate/engage/page/constants';
import { getPageConfigById } from '@shopgate/engage/page/selectors';
import { getPreferredLocation } from '@shopgate/engage/locations/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const isLocationBasedShopping = getIsLocationBasedShopping(state);
  const preferredLocation = getPreferredLocation(state);

  /**
   * Usually page rendering is postponed when location based shopping is active, and a location
   * was not selected yet.
   *
   * This is needed to prevent product requests by widgets without a location code.
   */
  let postponeRender = (isLocationBasedShopping && !preferredLocation);

  if (!props.isCookieConsentHandled && props.pageId !== PAGE_ID_INDEX) {
    /**
     * When cookie consent is active, the privacy policy link might redirect to a "page". Since
     * those pages shouldn't display any products, but need to be visible to the customer,
     * they are rendered as usual.
     */
    postponeRender = false;
  }

  return {
    configs: getPageConfigById(state, props),
    postponeRender,
  };
};

/**
 * Check to see if the page configs have arrived.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!isEqual(prev.configs, next.configs) || !isEqual(prev.postponeRender, next.postponeRender)) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
