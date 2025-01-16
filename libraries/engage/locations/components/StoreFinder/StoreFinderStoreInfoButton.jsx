import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { RippleButton } from '@shopgate/engage/components';
import { historyPush } from '@shopgate/engage/core';
import { connect } from 'react-redux';
import { StoreContext } from './Store.context';
import { i18n } from '../../../core';
import { StoreFinderContext } from '../../locations.context';
import {
  showStoreInfoButton, showStoreInfoButtonWrapper,
} from '../StoreList/Store.style';
import { STORE_DETAILS_PATH } from '../../constants';

/**
 * @param {Function} dispatch The dispatch function.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  openStoreDetail: code => dispatch(historyPush({
    pathname: `${STORE_DETAILS_PATH}/${code}`,
  })),
});

/**
 * The StoreFinderSelectLocationButton component.
 * @param {Function} openStoreDetail The openStoreDetail function.
 * @returns {JSX}
 */
const StoreFinderStoreInfoButton = ({ openStoreDetail }) => {
  const store = useContext(StoreContext);
  const { isComingSoon, isLoading } = useContext(StoreFinderContext);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    openStoreDetail(store?.code);
  }, [openStoreDetail, store]);

  return (
    <div className={showStoreInfoButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={showStoreInfoButton}
        disabled={(isLoading || isComingSoon)}
      >
        {i18n.text('locations.store_info')}
      </RippleButton>
    </div>
  );
};

StoreFinderStoreInfoButton.propTypes = {
  openStoreDetail: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(StoreFinderStoreInfoButton);
