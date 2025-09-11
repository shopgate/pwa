import { connect } from 'react-redux';
import {
  makeGetUnifiedCMSPageData,
} from '@shopgate/engage/page/selectors';
import { PAGE_ID_INDEX } from '@shopgate/engage/page/constants';
import {
  getIsLocationBasedShopping,
} from '@shopgate/engage/core/selectors';
import { getPreferredLocation } from '@shopgate/engage/locations/selectors';

/**
 * Creates the mapStateToProps connector function.
 * @param {Object} _ The current application state.
 * @param {Object} props The component props.
 * @returns {Function}
 */
const makeMapStateToProps = (_, { pageId }) => {
  const getUnifiedCMSPageData = makeGetUnifiedCMSPageData({ slug: pageId });

  return (state, props) => {
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

    const { cmsVersion, title, widgets } = getUnifiedCMSPageData(state) ?? {};

    return {
      postponeRender,
      isCmsV2Enabled: cmsVersion === 2,
      title,
      widgets,
    };
  };
};

export default connect(makeMapStateToProps);
