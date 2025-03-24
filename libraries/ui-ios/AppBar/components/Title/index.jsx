import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * The AppBarTitle component.
 */
class AppBarTitle extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  /**
   * @returns {JSX.Element}
   */
  render() {
    const { title } = this.props;

    if (!title) return null;

    return (
      <div
        className={classNames(styles, 'appBar__title')}
        role="heading"
        aria-level="1"
        aria-live="polite"
        tabIndex={-1}
        data-test-id={`title: ${title}`}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    );
  }
}

export default AppBarTitle;
