import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@shopgate/pwa-common/components/Grid';
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
    <Grid.Item role="presentation">
      <Button
        className={className}
        onClick={props.onClick}
        aria-hidden={props.hidden}
        tabIndex={props.tabIndex}
        role="tab"
      >
        {Icon}
        <div className={style.label} data-test-id={props.label}>
          <I18n.Text string={props.label} />
        </div>
        {props.children}
      </Button>
    </Grid.Item>
  );
};

TabBarAction.propTypes = {
  hidden: PropTypes.bool.isRequired,
  label: PropTypes.node.isRequired,
  tabIndex: PropTypes.number.isRequired,
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
