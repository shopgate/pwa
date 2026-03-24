import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  button: {
    width: '100%',
  },
});

/**
 * @param {props} props The component props.
 * @returns {JSX}
 */
const ContinueButton = ({ goBackHistory }) => {
  const { classes } = useStyles();
  return (
    <RippleButton
      className={classes.button}
      onClick={goBackHistory}
      type="secondary"
      testId="continueButton"
    >
      <I18n.Text string="favorites.continue" />
    </RippleButton>
  );
};

ContinueButton.propTypes = {
  goBackHistory: PropTypes.func.isRequired,
};

export default connect(ContinueButton);
