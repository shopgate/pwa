import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withForwardedRef } from '@shopgate/engage/core';
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
    description: PropTypes.string,
    forwardedRef: PropTypes.shape(),
    image: PropTypes.element,
    isDisabled: PropTypes.bool,
    isSelected: PropTypes.bool,
    link: PropTypes.string,
    linkComponent: PropTypes.func,
    linkState: PropTypes.shape(),
    onClick: PropTypes.func,
    rightComponent: PropTypes.element,
    testId: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    description: null,
    forwardedRef: null,
    image: null,
    isDisabled: false,
    isSelected: false,
    link: null,
    linkState: null,
    onClick: null,
    rightComponent: null,
    linkComponent: Link,
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
   * @param {boolean} [isNested=true] Tells if the content is rendered nested.
   * @returns {JSX}
   */
  renderContent(isNested = true) {
    const {
      isDisabled, isSelected, title, image, rightComponent, forwardedRef, description,
    } = this.props;

    const gridStyles = {
      [styles.grid]: true,
      [styles.selected]: isSelected,
    };
    const titleStyles = {
      [styles.title]: true,
      [styles.disabled]: isDisabled,
    };

    const ref = isNested ? null : forwardedRef;

    return (
      <div data-test-id={this.props.testId} ref={ref} className="engage__sheet-list__item">
        <Grid className={classNames(gridStyles)} component="div">
          {(image !== null) && (
            <div className={styles.image}>
              {image}
            </div>
          )}
          <Grid.Item className={classNames(titleStyles)} component="div" grow={1}>
            <div>
              {title}
            </div>
            { description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
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
      link,
      linkState,
      linkComponent: LinkComponent,
      onClick,
      className,
      isDisabled,
      testId,
      forwardedRef,
      isSelected,
    } = this.props;

    /**
     * If this item is disabled, selected or doesn't have a valid
     * link or click handler then wrap the content with other components.
     */
    if (isDisabled || (!link && !onClick)) {
      return this.renderContent(false);
    }

    // Wrap with a <Link> if the `link` prop is set.
    if (link) {
      return (
        <Glow
          ref={forwardedRef}
          className={className}
          styles={{ hover: styles.glowHover }}
        >
          <LinkComponent href={link} onClick={onClick} state={linkState} tabIndex={0}>
            {this.renderContent()}
          </LinkComponent>
        </Glow>
      );
    }

    return (
      <div
        onKeyPress={() => { }}
        onClick={onClick}
        data-test-id={testId}
        ref={forwardedRef}
        tabIndex={0}
        role="option"
        aria-selected={isSelected}
      >
        <Glow className={className} styles={{ hover: styles.glowHover }}>
          {this.renderContent()}
        </Glow>
      </div>
    );
  }
}

export default withForwardedRef(Item);
