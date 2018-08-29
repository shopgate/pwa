import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { FILTER_TYPE_RANGE } from '@shopgate/pwa-common-commerce/filter/constants';
import PriceSlider from './components/PriceSlider';
import Selector from './components/Selector';
import ResetButton from './components/ResetButton';
import buildInitialFilters from './helpers/buildInitialFilters';
import consume from './consumer';

/**
 * The FilterContent component.
 */
class FilterContent extends Component {
  static propTypes = {
    activeFilters: PropTypes.shape(), /* eslint-disable-line */
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

    this.initialFilters = buildInitialFilters(props.filters, props.activeFilters);
    this.state = this.initialFilters;
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps({ activeFilters, filters }) {
    if (Object.keys(this.initialFilters).length > 0) {
      return;
    }

    this.initialFilters = buildInitialFilters(filters, activeFilters);
    this.reset();
  }

  /**
   * Determine if there are filters that have been changed.
   * @returns {boolean}
   */
  get hasChanged() {
    return !isEqual(this.state, this.initialFilters);
  }

  /**
   * @param {string} id The id of the filter to add.
   * @param {Array} value The selected values of the filter.
   */
  update = (id, value) => {
    this.setState({ [id]: value });
  }

  updateDebounced = debounce(this.update, 50)

  reset = () => {
    this.setState(this.initialFilters);
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
          const value = this.state[filter.id];

          if (filter.type === FILTER_TYPE_RANGE) {
            return (
              <PriceSlider
                id={filter.id}
                key={filter.id}
                min={filter.minimum}
                max={filter.maximum}
                onChange={this.updateDebounced}
                value={value}
              />
            );
          }

          return <Selector id={filter.id} key={filter.id} label={filter.label} values={filter.values} />;
        })}
        <ResetButton active={this.hasChanged} onClick={this.reset} />
      </Fragment>
    );
  }
}

export default consume(FilterContent);
