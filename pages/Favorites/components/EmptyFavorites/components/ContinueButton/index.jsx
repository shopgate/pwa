import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import connect from './connector';
import styles from './style';

/**
 * ContinueButton component
 * @param {props} props The component props.
 * @returns {JSX}
 */
class ContinueButton extends Component {
  static propTypes = {
    goBackHistory: PropTypes.func.isRequired,
  };

  /**
   * Render
   * @return {JSX}
   */
  render() {
    return (
      <RippleButton onClick={this.props.goBackHistory} className={styles.button} type="secondary" testId="continueButton">
        <I18n.Text string="favorites.continue" />
      </RippleButton>
    );
  }
}

export default connect(ContinueButton);
