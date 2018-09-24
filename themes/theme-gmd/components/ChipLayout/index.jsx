import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import variables from 'Styles/variables';
import styles from './style';

/**
 * The height of one row.
 * @type {number}
 */
export const CHIP_ROW_HEIGHT = 34;

/**
 * The minimum width that a chip should have.
 * @type {number}
 */
export const CHIP_MINIMUM_WIDTH = 60;

/**
 * The ChipLayout component.
 */
class ChipLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
    handleMoreButton: PropTypes.func,
    invertMoreButton: PropTypes.bool,
    maxRows: PropTypes.number,
    moreLabel: PropTypes.string,
    // This prop is required to force rendering when pathname changes.
    // eslint-disable-next-line react/no-unused-prop-types
    pathname: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    handleMoreButton: () => {},
    invertMoreButton: false,
    maxRows: 2,
    moreLabel: 'more',
    pathname: '',
  };

  /**
   * When the component mounts we need to initially process all children.
   */
  componentDidMount() {
    this.processHiddenElements();
  }

  /**
   * Eveyry time pathname or other prop changes this callback is called.
   * This funtion will start processing hidden elements in order to check if "more" button
   * should be rendered.
   *
   * It must be done on every prop change, including the pathname.
   * Sometimes this component is rendered invisible, then since `.processHiddenElements` uses
   * refs.clientHeight it would always be zero.
   */
  componentDidUpdate() {
    this.processHiddenElements();
  }

  /**
   * Returns the maximum height the container should have.
   * @returns {number}
   */
  get maxContentHeight() {
    // 8 -> container padding.
    return (CHIP_ROW_HEIGHT * this.props.maxRows) + 8;
  }

  /**
   * Returns the more button styles.
   * @return {string} The store button class name.
   */
  get moreButtonStyles() {
    if (this.props.invertMoreButton) {
      return styles.moreButtonInverted;
    }

    return styles.moreButton;
  }

  /**
   * Loops through all children to make sure the more button appears if there is too much content.
   */
  processHiddenElements() {
    // Find out if there are overflowing elements.
    let lastVisibleElement = 0;
    const showMoreButton = this.containerRef.scrollHeight > this.containerRef.clientHeight;
    const containerHeight = this.containerRef.clientHeight;
    const chips = Array.from(this.layoutRef.children);

    this.moreButtonRef.style.display = showMoreButton ? 'block' : 'none';
    this.layoutRef.style.minHeight = showMoreButton ? `${this.maxContentHeight}px` : '0px';

    // If the more button is not visible we don't need to process anything.
    if (!showMoreButton) {
      return;
    }

    // Hide or show chips that are hidden due to overflow.
    chips.forEach((child, index) => {
      const isVisible = (child.offsetTop + child.clientHeight) < containerHeight;
      child.setAttribute('style', `display: ${isVisible ? 'flex' : 'none'};`);

      if (isVisible) {
        lastVisibleElement = index;
      }
    });

    // Hide the more button if previous assumption was incorrect.
    if (lastVisibleElement === (chips.length - 1)) {
      this.moreButtonRef.style.display = 'none';
      return;
    }

    // Hide elements so that the 'more button' has enough space.
    chips.slice(0, lastVisibleElement + 1).reverse().every((element) => {
      const offsetBottom = element.offsetTop + element.clientHeight;
      if (this.moreButtonRef.offsetTop > offsetBottom) {
        return true;
      }

      const buttonSpaceRequired = this.moreButtonRef.clientWidth + variables.gap.big;
      const elementRight = this.containerRef.clientWidth -
        (element.offsetLeft + element.clientWidth);
      const spaceDiff = buttonSpaceRequired - elementRight;
      const remainingChipWidth = element.clientWidth - spaceDiff;

      if (remainingChipWidth > CHIP_MINIMUM_WIDTH) {
        element.setAttribute('style', `max-width: ${remainingChipWidth}px`);
        return false;
      } else if (element.offsetTop !== chips[lastVisibleElement].offsetTop) {
        element.setAttribute('style', 'display: none');
        return false;
      }

      element.setAttribute('style', 'display: none');
      return true;
    });
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <div
        ref={(element) => { this.containerRef = element; }}
        className={styles.container(this.maxContentHeight)}
      >
        <div ref={(element) => { this.layoutRef = element; }} className={styles.layout}>
          {this.props.children}
        </div>

        <div
          ref={(element) => { this.moreButtonRef = element; }}
          className={styles.moreButtonWrapper}
        >
          <RippleButton
            fill
            type="plain"
            className={this.moreButtonStyles}
            onClick={this.props.handleMoreButton}
          >
            <I18n.Text string={this.props.moreLabel} />
          </RippleButton>
        </div>
      </div>
    );
  }
}

export default ChipLayout;
