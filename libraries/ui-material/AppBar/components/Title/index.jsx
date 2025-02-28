import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
   * focus the title for screen readers when page loads
   */
  componentDidMount() {
    // Delay focus slightly to ensure it is recognized by screen readers
    setTimeout(() => {
      if (this.titleRef.current) {
        this.titleRef.current.focus();
      }
    }, 100);
  }

  titleRef = React.createRef();

  /**
   * @returns {JSX.Element}
   */
  render() {
    const { onClick, title } = this.props;

    return (
      <div
        ref={this.titleRef}
        className={styles}
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
