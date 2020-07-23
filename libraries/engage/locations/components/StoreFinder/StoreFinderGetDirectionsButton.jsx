import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import { RippleButton } from '@shopgate/engage/components';
import { container, button } from './StoreFinderGetDirectionsButton.style';
import connect from './StoreFinderGetDirectionsButton.connector';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderGetDirectionsButton = ({ address, openMap, className }) => {
  const url = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  const handleClick = useCallback(() => {
    openMap(url);
  }, [openMap, url]);

  if (!address) {
    return null;
  }

  return (
    <div className={classNames(container, className)}>
      <RippleButton
        onClick={handleClick}
        className={button}
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
