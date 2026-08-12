import React, { useMemo } from 'react';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import PropTypes from 'prop-types';
import { ButtonBase } from '@shopgate/engage/components/v2';
import { generateGoogleMapsDirectionsUrl, i18n } from '@shopgate/engage/core';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  buttonText: {
    color: theme.palette.primary.main,
  },
}));

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
    <div>
      <ButtonBase onClick={handleClick}>
        <span className={classes.buttonText}>
          {i18n.text('location.getDirections')}
        </span>
      </ButtonBase>
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
