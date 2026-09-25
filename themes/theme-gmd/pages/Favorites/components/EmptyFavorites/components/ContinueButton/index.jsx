import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import connect from './connector';

/**
 * @param {props} props The component props.
 * @returns {JSX}
 */
const ContinueButton = ({ goBackHistory }) => (
  <Button
    color="primary"
    fullWidth
    onClick={goBackHistory}
    testId="continueButton"
  >
    <I18n.Text string="favorites.continue" />
  </Button>
);

ContinueButton.propTypes = {
  goBackHistory: PropTypes.func.isRequired,
};

export default connect(ContinueButton);
