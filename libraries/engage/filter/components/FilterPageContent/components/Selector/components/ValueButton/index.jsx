import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

/**
 * The value button component.
 */
class ValueButton extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    isActive: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    id: null,
    label: null,
    isActive: false,
    onClick() { },
  };

  /**
   * @returns {string}
   */
  get className() {
    const classes = withStyles.getClasses(this.props);
    const { isActive } = this.props;

    return classNames({
      [classes.inactive]: !isActive,
      [classes.active]: isActive,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      label, id, onClick, isActive,
    } = this.props;

    return (
      <button
        className={this.className}
        value={id}
        onClick={onClick}
        data-test-id={id}
        type="button"
        role="checkbox"
        aria-checked={isActive}
      >
        {label}
      </button>
    );
  }
}

export default withStyles(
  ValueButton,
  () => ({
    inactive: {
      border: `1px solid ${themeColors.darkGray}`,
      borderRadius: 2,
      color: 'inherit',
      height: 42,
      marginLeft: 8,
      marginBottom: 8,
      maxWidth: '100%',
      minWidth: 42,
      outline: 0,
      overflow: 'hidden',
      padding: '0 8px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      transition: 'color 100ms cubic-bezier(0.25, 0.1, 0.25, 1), border-color 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      willChange: 'color, border-color',
    },
    active: {
      border: `1px solid ${themeColors.darkGray}`,
      borderRadius: 2,
      color: 'var(--color-secondary)',
      height: 42,
      marginLeft: 8,
      marginBottom: 8,
      maxWidth: '100%',
      minWidth: 42,
      outline: 0,
      overflow: 'hidden',
      padding: '0 8px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      transition: 'color 100ms cubic-bezier(0.25, 0.1, 0.25, 1), border-color 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      willChange: 'color, border-color',
      borderColor: 'var(--color-secondary)',
    },
  })
);
