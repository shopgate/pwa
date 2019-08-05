import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Button from '@shopgate/pwa-ui-shared/Button';
import { withWidgetSettings } from '@shopgate/engage/core';
import styles from './style';

/**
 * The filter apply button component.
 */
class FilterApplyButton extends PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    widgetSettings: PropTypes.shape().isRequired,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { active, onClick, widgetSettings } = this.props;
    const { buttonTextColor, buttonTextColorDisabled } = widgetSettings;
    const buttonColor = active ? buttonTextColor : buttonTextColorDisabled;

    return (
      <div className={styles.wrapper}>
        <Button className={styles.button} flat type="primary" onClick={onClick} disabled={!active} testId="applyFilterButton">
          <span style={{ color: buttonColor }}>
            <I18n.Text string="filter.apply" />
          </span>
        </Button>
      </div>
    );
  }
}

export default withWidgetSettings(FilterApplyButton, '@shopgate/engage/components/AppBar');
