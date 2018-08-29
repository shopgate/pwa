import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import PriceSlider from './components/PriceSlider';
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
    activeFilters: {},
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

  /**
   * @param {string} id The id of the filter to add.
   * @param {Array} value The selected values of the filter.
   */
  addFilter = (id, value) => {
    this.setState(prevState => ({
      activeFilters: {
        ...prevState.activeFilters,
        [id]: value,
      },
    }));
  }

  /**
   * @param {string} id The id of the filter to remove.
   */
  removeFilter = (id) => {
    this.setState((prevState) => {
      const { [id]: removed, ...activeFilters } = prevState.activeFilters;
      return { activeFilters };
    });
  }

  resetFilters = () => {
    this.setState({ activeFilters: {} });
  }

  /**
   * Handle a filter change. the updated value can lead
   * to a filter being added or removed from the state.
   * @param {string} id The id of the changed filter.
   * @param {Array} value The changed value of the filter.
   */
  handleChange = (id, value) => {
    const { filters } = this.props;

    // Find the available filter by the given id;
    const filter = filters.find(item => item.id === id);

    if (filter.type === 'range') {
      // Remove the filter when the ranges are equal to the minimum and maximum.
      if (value[0] === filter.minimum && value[1] === filter.maximum) {
        this.removeFilter(id);
        return;
      }

      this.addFilter(id, value);
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { filters } = this.props;

    if (!filters) {
      return null;
    }

    return (
      <Fragment>
        {filters.map((filter) => {
          switch (filter.type) {
            case 'range': {
              return (
                <PriceSlider
                  id={filter.id}
                  key={filter.id}
                  min={filter.minimum}
                  max={filter.maximum}
                  onChange={debounce(this.handleChange, 50)}
                />
              );
            }
            default:
              return null;
          }
        })}
      </Fragment>
    );
  }
}

export default consume(FilterContent);
