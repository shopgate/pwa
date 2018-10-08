import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DefaultBar from '../DefaultBar';

/**
 * The SimpleBar component.
 */
class SimpleBar extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { title } = this.props;

    return (
      <DefaultBar title={title} right={null} />
    );
  }
}

export default SimpleBar;
