import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Link';
import Glow from '@shopgate/pwa-ui-shared/Glow';
import styles from './style';

/**
 * The list item component.
 */
class Item extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    image: PropTypes.element,
    isDisabled: PropTypes.bool,
    isSelected: PropTypes.bool,
    link: PropTypes.string,
    linkState: PropTypes.shape(),
    onClick: PropTypes.func,
    rightComponent: PropTypes.element,
    testId: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    image: null,
    isDisabled: false,
    isSelected: false,
    link: null,
    linkState: null,
    onClick: null,
    rightComponent: null,
    testId: null,
  };

  /**
   * Should only update what the `selected` or `disabled` props change.
   * @param {Object} nextProps The next set of component props.
   * @returns {JSX}
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.isSelected !== nextProps.isSelected ||
      this.props.isDisabled !== nextProps.isDisabled
    );
  }

  /**
   * Renders the bulk of the content.
   * @returns {JSX}
   */
  renderContent() {
    const {
      isDisabled, isSelected, title, image, rightComponent,
    } = this.props;

    const gridStyles = {
      [styles.grid]: true,
      [styles.selected]: isSelected,
    };
    const titleStyles = {
      [styles.title]: true,
      [styles.disabled]: isDisabled,
    };

    return (
      <div data-test-id={this.props.testId}>
        <Grid className={classNames(gridStyles)} component="div">
          {(image !== null) && (
            <div className={styles.image}>
              {image}
            </div>
          )}
          <Grid.Item className={classNames(titleStyles)} component="div" grow={1}>
            {title}
          </Grid.Item>
          {(rightComponent !== null) && (
            <Grid.Item component="div" grow={1}>
              {rightComponent}
            </Grid.Item>
          )}
        </Grid>
      </div>
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      link, linkState, onClick, className, isDisabled, testId,
    } = this.props;

    /**
     * If this item is disabled, selected or doesn't have a valid
     * link or click handler then wrap the content with other components.
     */
    if (isDisabled || (!link && !onClick)) {
      return this.renderContent();
    }

    // Wrap with a <Link> if the `link` prop is set.
    if (link) {
      return (
        <Glow className={className} styles={{ hover: styles.glowHover }}>
          <Link href={link} onClick={onClick} state={linkState}>
            {this.renderContent()}
          </Link>
        </Glow>
      );
    }

    return (
      <div
        role="link"
        tabIndex="0"
        onKeyPress={() => { }}
        onClick={onClick}
        data-test-id={testId}
      >
        <Glow className={className} styles={{ hover: styles.glowHover }}>
          {this.renderContent()}
        </Glow>
      </div>
    );
  }
}

export default Item;
