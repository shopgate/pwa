import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The placeholder component.
 */
class Placeholder extends PureComponent {
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  };
  /* eslint-enable react/no-unused-prop-types */

  static defaultProps = {
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  };

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div className={styles} style={this.props} />
    );
  }
}

export default Placeholder;
