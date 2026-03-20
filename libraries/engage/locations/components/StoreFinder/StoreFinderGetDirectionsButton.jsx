import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { RippleButton } from '@shopgate/engage/components';
import connect from './StoreFinderGetDirectionsButton.connector';

const useStyles = makeStyles()({
  container: {},
  button: {
    width: '100%',
    background: 'var(--color-primary)!important',
    color: 'var(--color-primary-contrast)!important',
    fontSize: '0.875rem !important',
  },
});

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderGetDirectionsButton = ({ address, openMap, className }) => {
  const { classes } = useStyles();
  const url = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  const handleClick = useCallback(() => {
    openMap(url);
  }, [openMap, url]);

  if (!address) {
    return null;
  }

  return (
    <div className={classNames(classes.container, className)}>
      <RippleButton
        onClick={handleClick}
        className={classes.button}
      >
        {i18n.text('locations.get_directions')}
      </RippleButton>
    </div>
  );
};

StoreFinderGetDirectionsButton.propTypes = {
  address: PropTypes.shape(),
  className: PropTypes.string,
  openMap: PropTypes.func,
};

StoreFinderGetDirectionsButton.defaultProps = {
  address: null,
  openMap: () => {},
  className: null,
};

export default connect(StoreFinderGetDirectionsButton);
