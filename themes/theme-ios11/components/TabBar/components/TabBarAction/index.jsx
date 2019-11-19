import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@shopgate/pwa-common/components/Button';
import I18n from '@shopgate/pwa-common/components/I18n';
import style from './style';

/**
 * Renders the tab bar action component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TabBarAction = (props) => {
  const Icon = props.icon;

  const className = classNames(
    style.container,
    { [style.highlighted]: props.isHighlighted },
    { [style.regular]: !props.isHighlighted }
  );

  return (
    <Button
      className={className}
      onClick={props.onClick}
      aria-selected={!props['aria-hidden'] && props.isHighlighted}
      aria-hidden={props['aria-hidden']}
      aria-label={props['aria-label']}
      tabIndex={props.tabIndex}
      role="tab"
    >
      {Icon}
      <div className={style.label} data-test-id={props.label}>
        <I18n.Text string={props.label} />
      </div>
      {props.children}
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
