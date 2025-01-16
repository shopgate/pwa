import React, { useMemo } from 'react';
import { css } from 'glamor';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import PropTypes from 'prop-types';
import { Button } from '@shopgate/engage/components';
import { generateGoogleMapsDirectionsUrl, i18n } from '@shopgate/engage/core';
import { useDispatch } from 'react-redux';

const styles = {
  container: css({
    margin: '8px 0',
  }),
  buttonText: css({
    color: 'var(--color-primary)',
  }),
};

/**
 * @param {Object} props The component props
 * @param {Object} props.address The address object.
 * @returns {JSX}
 */
const StoreFinderGetDirectionsButton = ({ address }) => {
  const dispatch = useDispatch();
  const url = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  /**
   * Handles the button click.
   */
  const handleClick = () => {
    dispatch(historyPush({
      pathname: url,
      state: {
        target: '_blank',
      },
    }));
  };

  return (
    <div className={styles.container}>
      <Button
        onClick={handleClick}
        role="button"
        type="plain"
      >
        <span className={styles.buttonText}>
          {i18n.text('location.getDirections')}
        </span>
      </Button>
    </div>

  );
};

StoreFinderGetDirectionsButton.propTypes = {
  address: PropTypes.shape(),
};

StoreFinderGetDirectionsButton.defaultProps = {
  address: null,
};

export default StoreFinderGetDirectionsButton;
