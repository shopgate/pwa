import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import PriceSlider from './components/PriceSlider';
import Selector from './components/Selector';
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
                  key={filter.id}
                  min={filter.minimum}
                  max={filter.maximum}
                />
              );
            }
            default:
              return <Selector key={filter.id} label={filter.label} values={filter.values} />;
          }
        })}
      </Fragment>
    );
  }
}

export default consume(FilterContent);
