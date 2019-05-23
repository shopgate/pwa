import React from 'react';
import PropTypes from 'prop-types';
import { I18n, RippleButton } from '@shopgate/engage/components';
import connect from './connector';
import styles from './style';

/**
 * @param {props} props The component props.
 * @returns {JSX}
 */
const ContinueButton = ({ goBackHistory }) => (
  <RippleButton
    className={styles.button}
    onClick={goBackHistory}
    type="secondary"
    testId="continueButton"
  >
    <I18n.Text string="favorites.continue" />
  </RippleButton>
);

ContinueButton.propTypes = {
  goBackHistory: PropTypes.func.isRequired,
};

export default connect(ContinueButton);
