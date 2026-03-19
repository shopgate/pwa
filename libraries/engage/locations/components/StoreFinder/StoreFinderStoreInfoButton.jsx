import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { RippleButton } from '@shopgate/engage/components';
import { historyPush } from '@shopgate/engage/core';
import { connect } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { StoreContext } from './Store.context';
import { i18n } from '../../../core';
import { StoreFinderContext } from '../../locations.context';
import { STORE_DETAILS_PATH } from '../../constants';

const { gap } = themeVariables;

const useStyles = makeStyles()({
  showStoreInfoButton: {
    width: '100%',
    fontSize: '.875rem !important',
    ':not(:disabled)': {
      background: 'var(--color-primary)!important',
      color: 'var(--color-primary-contrast)!important',
    },
  },
  showStoreInfoButtonWrapper: {
    padding: `0 ${gap.big}px ${gap.small}px ${gap.big}px`,
  },
});

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
 * The StoreFinderStoreInfoButton component.
 * @param {Function} openStoreDetail The openStoreDetail function.
 * @returns {JSX}
 */
const StoreFinderStoreInfoButton = ({ openStoreDetail }) => {
  const { classes } = useStyles();
  const store = useContext(StoreContext);
  const { isLoading } = useContext(StoreFinderContext);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    openStoreDetail(store?.code);
  }, [openStoreDetail, store]);

  return (
    <div className={classes.showStoreInfoButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={classNames(classes.showStoreInfoButton)}
        disabled={isLoading}
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
