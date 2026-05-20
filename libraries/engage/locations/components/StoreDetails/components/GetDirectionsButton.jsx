import React, { useMemo } from 'react';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import PropTypes from 'prop-types';
import { Button } from '@shopgate/engage/components';
import { generateGoogleMapsDirectionsUrl, i18n } from '@shopgate/engage/core';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  container: {},
  buttonText: {
    color: 'var(--color-primary)',
  },
});

/**
 * @param {Object} props The component props
 * @param {Object} props.address The address object.
 * @returns {JSX}
 */
const GetDirectionsButton = ({ address }) => {
  const { classes } = useStyles();
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
    <div className={classes.container}>
      <Button
        onClick={handleClick}
        role="button"
        type="plain"
      >
        <span className={classes.buttonText}>
          {i18n.text('location.getDirections')}
        </span>
      </Button>
    </div>

  );
};

GetDirectionsButton.propTypes = {
  address: PropTypes.shape(),
};

GetDirectionsButton.defaultProps = {
  address: null,
};

export default GetDirectionsButton;
