import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The AppBarTitle component.
 */
class AppBarTitle extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  /**
   * focus the title for screen readers when page loads
   */
  componentDidMount() {
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
      const { title } = this.props;

      return (
        <div
          ref={this.titleRef}
          className={styles}
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
