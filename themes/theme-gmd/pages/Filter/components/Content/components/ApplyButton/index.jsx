import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n, Button } from '@shopgate/engage/components';
import styles from './style';

/**
 * The filter apply button component.
 */
class FilterApplyButton extends PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { active, onClick } = this.props;

    return (
      <div className={styles}>
        <Button flat type="primary" onClick={onClick} disabled={!active} testId="applyFilterButton">
          <I18n.Text string="filter.apply" />
        </Button>
      </div>
    );
  }
}

export default FilterApplyButton;
