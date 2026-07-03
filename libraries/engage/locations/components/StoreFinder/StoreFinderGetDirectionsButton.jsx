import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { RippleButton } from '@shopgate/engage/components';
import connect from './StoreFinderGetDirectionsButton.connector';

const useStyles = makeStyles()(theme => ({
  container: {},
  button: {
    width: '100%',
    background: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.primary.contrastText} !important`,
    fontSize: `${theme.typography.body2.fontSize} !important`,
  },
}));

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderGetDirectionsButton = ({ address, openMap, className }) => {
  const { classes, cx } = useStyles();
  const url = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  const handleClick = useCallback(() => {
    openMap(url);
  }, [openMap, url]);

  if (!address) {
    return null;
  }

  return (
    <div className={cx(classes.container, className)}>
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
