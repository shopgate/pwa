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
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  /**
   * @returns {JSX.Element}
   */
  render() {
    const { onClick, title } = this.props;

    if (!title) return null;

    return (
      <div
        className={classNames(styles, 'theme__app-bar__title')}
        role="heading"
        aria-labelledby="titleLabel"
        aria-level="1"
        data-test-id={`title: ${title}`}
        tabIndex={-1}
      >
        <span role="presentation" onClick={onClick} id="titleLabel" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
    );
  }
}

export default AppBarTitle;
