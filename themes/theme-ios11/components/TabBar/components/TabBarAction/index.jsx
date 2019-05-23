import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@shopgate/pwa-common/components/Button';
import { I18n } from '@shopgate/engage/components';
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
  children: PropTypes.node,
  icon: PropTypes.element,
  isHighlighted: PropTypes.bool,
  onClick: PropTypes.func,
};

TabBarAction.defaultProps = {
  children: null,
  icon: null,
  isHighlighted: false,
  onClick: null,
};

export default TabBarAction;
