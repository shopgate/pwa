import { connect } from 'react-redux';
import { makeGetDefaultSortOrder, makeExtendedSortOptionsSupported } from '@shopgate/engage/filter';
import { getSortOrder, historyReplace, getCurrentRoute } from '@shopgate/engage/core';

/**
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getDefaultSortOrder = makeGetDefaultSortOrder();
  const extendedSortOptionsSupported = makeExtendedSortOptionsSupported();

  return (state, props) => {
    const routeId = props?.route?.id;

    const extendedProps = {
      ...props,
      routeId,
    };

    return {
      defaultOrder: getDefaultSortOrder(state, extendedProps),
      extendedOptionsSupported: extendedSortOptionsSupported(state, extendedProps),
      currentOrder: getSortOrder(state, extendedProps),
      currentRoute: getCurrentRoute(state, extendedProps),
    };
  };
};

const mapDispatchToProps = {
  historyReplace,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
