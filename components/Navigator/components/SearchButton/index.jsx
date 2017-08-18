import React, { PropTypes, Component } from 'react';
import { MagnifierIcon } from 'Templates/components/icons';
import { Ripple } from 'Templates/components';
import styles from './style';

/**
 * The search button component.
 */
class SearchButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: () => {},
  };

  /**
   * This component doesnt need to update at all.
   * @returns {boolean}
   */
  shouldComponentUpdate() {
    return false;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <button className={styles.button} onClick={this.props.onClick}>
        <Ripple className={styles.buttonContent}>
          <MagnifierIcon />
        </Ripple>
      </button>
    );
  }
}

export default SearchButton;
