import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@shopgate/pwa-common/components/Button';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CrossIcon from '../icons/CrossIcon';
import styles from './style';

/**
 * The Chip component.
 */
class Chip extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    invert: PropTypes.bool,
    onClick: PropTypes.func,
    onRemove: PropTypes.func,
    removable: PropTypes.bool,
  };

  static defaultProps = {
    invert: false,
    onClick: () => {},
    onRemove: () => {},
    removable: true,
  };

  /**
   * When the component updates make sure that inline styles are removed.
   * This is required because even when re-rendering the component, react doesn't
   * check the inline stylings.
   * We therefore explicitly force to remove the styling after rendering.
   * ChipsLayout will add custom styles and expects the component to not have any styling
   * after re-rendering.
   */
  componentDidUpdate() {
    this.elementRef.removeAttribute('style');
  }

  /**
   * Returns a class name for the wrapper.
   * @returns {string}
   */
  get wrapperStyle() {
    return styles.chip(this.props.removable, this.props.invert);
  }

  /**
   * Returns the chip's font color.
   * @returns {string}
   */
  get crossFontColor() {
    if (this.props.invert) {
      return themeConfig.colors.light;
    }

    return themeConfig.colors.accent;
  }

  handleRemove = () => {
    this.props.onRemove(this.props.id);
  }

  /**
   * Renders the remove icon of the chip if it can be removable.
   * @returns {JSX|null}
   */
  renderRemoveIcon() {
    if (!this.props.removable) {
      return null;
    }

    return (
      <Button className={styles.removeButton} onClick={this.handleRemove} testId="removeFilter">
        <CrossIcon size={16} color={this.crossFontColor} />
      </Button>
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div
        ref={(element) => { this.elementRef = element; }}
        className={this.wrapperStyle}
        data-test-id={this.props.id}
      >
        {this.renderRemoveIcon()}
        <Button className={styles.name} onClick={this.props.onClick}>
          {this.props.children}
        </Button>
      </div>
    );
  }
}

export default Chip;
