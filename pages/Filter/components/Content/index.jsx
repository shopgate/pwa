import React, { Component } from 'react';
import PropTypes from 'prop-types';
import consume from './consumer';

// TODO: Allows to add/update/remove an active filter
// TODO: Render the UI components based on filter type
// TODO: Create the Apply button via react portal
// TODO: Contains the clear button

/**
 * The FilterContent component.
 */
class FilterContent extends Component {
  static propTypes = {
    activeFilters: PropTypes.shape(),
    filters: PropTypes.arrayOf(PropTypes.shape()),
  }

  static defaultProps = {
    activeFilters: null,
    filters: null,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      activeFilters: props.activeFilters,
    };
  }

  addFilter = () => {

  }

  removeFilter = () => {

  }

  resetFilters = () => {
    this.setState({ activeFilters: {} });
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div>
        {JSON.stringify(this.state)}
        {JSON.stringify(this.props.filters)}
      </div>
    );
  }
}

export default consume(FilterContent);
