import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import ActionButton from '@shopgate/pwa-ui-shared/ActionButton';
import connect from './connector';

/**
 * The apply filter button component.
 */
class ApplyFilterButton extends Component {
  static propTypes = {
    applyFilters: PropTypes.func.isRequired,
    filtersChanged: PropTypes.bool,
  };

  static defaultProps = {
    filtersChanged: true,
  };

  /**
   * Apply filters and fire up the DeLorean.
   */
  handleApplyFilters = () => {
    this.props.applyFilters();
  }

  /**
   * [render description]
   * @returns {JSX}
   */
  render() {
    return (
      <ActionButton
        onClick={this.handleApplyFilters}
        disabled={!this.props.filtersChanged}
      >
        <I18n.Text string="filter.apply" />
      </ActionButton>
    );
  }
}

export default connect(ApplyFilterButton);

// For testing.
export { ApplyFilterButton as Unwrapped };
