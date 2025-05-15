import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import Button from '@shopgate/pwa-common/components/Button';
import I18n from '@shopgate/pwa-common/components/I18n';
import style from './style';

/**
 * Renders the tab bar action component.
 * @param {Object} props The component properties.
 * @param {React.ReactElement} props.icon The icon of the action.
 * @param {string} props.label The label of the action.
 * @param {boolean} props.isHighlighted Whether the action is highlighted (selected).
 * @param {Function} props.onClick The click handler for the action.
 * @param {number} props.tabIndex The tab index for the action.
 * @param {boolean} props.['aria-hidden'] The aria-hidden attribute for accessibility.
 * @param {string} props.['aria-label'] The aria-label attribute for accessibility.
 * @param {React.ReactNode} props.children The children of the action.
 * @returns {JSX}
 */
const TabBarAction = ({
  icon: Icon,
  label,
  isHighlighted,
  onClick,
  tabIndex,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  children,
  ...props
}) => {
  const { showLabels = true } = useWidgetSettings('@shopgate/engage/components/TabBar');

  // Remove some props that are not meant for the Button component.
  const {
    // eslint-disable-next-line react/prop-types
    dispatch, historyPush, path, type, ...buttonProps
  } = props;

  const className = classNames(
    'theme__tab-bar__tab-bar-action',
    style.container,
    { [style.highlighted]: isHighlighted },
    { 'tab-active': isHighlighted },
    { [style.regular]: !isHighlighted }
  );

  return (
    <Button
      className={className}
      onClick={onClick}
      aria-selected={!ariaHidden && isHighlighted}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      data-type={type}
      role="tab"
      {...buttonProps}
    >
      {Icon}
      <div className={classNames(style.label, 'theme__tab-bar__tab-bar-action__label')} data-test-id={label}>
        {showLabels && <I18n.Text string={label} />}
      </div>
      {children}
    </Button>
  );
};

TabBarAction.propTypes = {
  label: PropTypes.node.isRequired,
  'aria-hidden': PropTypes.bool,
  'aria-label': PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.element,
  isHighlighted: PropTypes.bool,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
};

TabBarAction.defaultProps = {
  'aria-hidden': null,
  'aria-label': null,
  children: null,
  icon: null,
  isHighlighted: false,
  onClick: null,
  tabIndex: null,
};

export default TabBarAction;
