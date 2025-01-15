import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import PropTypes from 'prop-types';
import { Button } from '@shopgate/engage/components';
import { generateGoogleMapsDirectionsUrl, i18n } from '@shopgate/engage/core';

const styles = {
  container: css({
    margin: '8px 0',
  }),
  buttonText: css({
    color: 'var(--color-primary)',
  }),
};

/**
 * Maps state to props.
 * @param {Function} dispatch The dispatch function.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  openMap: url => dispatch(historyPush({
    pathname: url,
    state: {
      target: '_blank',
    },
  })),
});

/**
 * @param {Object} props The component props
 * @param {Object} props.address The address object.
 * @param {Function} props.openMap The openMap function.
 * @returns {JSX}
 */
const StoreFinderGetDirectionsButton = ({ address, openMap }) => {
  const url = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  return (
    <div className={styles.container}>
      <Button
        onClick={() => openMap(url)}
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
  openMap: PropTypes.func.isRequired,
  address: PropTypes.shape(),
};

StoreFinderGetDirectionsButton.defaultProps = {
  address: null,
};

export default connect(null, mapDispatchToProps)(StoreFinderGetDirectionsButton);
