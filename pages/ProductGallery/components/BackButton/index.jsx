import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@shopgate/pwa-common/components/Button';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import ArrowIcon from '@shopgate/pwa-ui-shared/icons/ArrowIcon';
import styles from 'Components/Navigator/components/NavButton/style';
import connect from './connector';

/**
 * The back button component is a special nav button type that only supports history pop actions.
 */
class BackButton extends PureComponent {
  static propTypes = {
    goBackHistory: PropTypes.func,
  };

  static defaultProps = {
    goBackHistory: () => {},
  };

  /**
   * Handles a click on the icon.
   * @param {Object} event The event object.
   */
  handleClick = (event) => {
    event.preventDefault();
    this.props.goBackHistory();
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <Button className={styles.button} onClick={this.handleClick}>
        <Ripple className={styles.buttonContent}>
          <ArrowIcon shadow />
        </Ripple>
      </Button>
    );
  }
}

export default connect(BackButton);
