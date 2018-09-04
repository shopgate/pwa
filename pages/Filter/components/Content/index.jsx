import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import conductor from '@virtuous/conductor';
import { FILTER_TYPE_RANGE } from '@shopgate/pwa-common-commerce/filter/constants';
import { PORTAL_NAVIGATOR_BUTTON } from 'Components/Navigator/constants';
import PriceSlider from './components/PriceSlider';
import Selector from './components/Selector';
import ApplyButton from './components/ApplyButton';
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
    parentId: PropTypes.string,
  }

  static defaultProps = {
    activeFilters: null,
    filters: null,
    parentId: null,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.initialFilters = buildInitialFilters(props.filters, props.activeFilters);
    this.navigatorPosition = document.getElementById(PORTAL_NAVIGATOR_BUTTON);
    this.state = {
      currentFilters: props.activeFilters || {},
      filters: {},
    };
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps({ activeFilters, filters }) {
    if (Object.keys(this.initialFilters).length > 0) {
      return;
    }

    this.initialFilters = buildInitialFilters(filters, activeFilters);
  }

  /**
   * Determine if there are filters that have been changed.
   * @returns {boolean}
   */
  get canReset() {
    return (
      !!(Object.keys(this.state.currentFilters).length || Object.keys(this.state.filters).length)
    );
  }

  /**
   * Determine if there are filters that have been changed.
   * @returns {boolean}
   */
  get hasChanged() {
    return (
      Object.keys(this.state.filters).length > 0
      || !!(Object.keys(this.state.currentFilters).length === 0 && this.props.activeFilters)
    );
  }

  /**
   * @param {string} id The filter is to look for.
   * @returns {Array}
   */
  getFilterValue = id => (
    this.state.filters[id] || this.initialFilters[id]
  )

  /**
   * @param {string} id The id of the filter to add.
   * @param {Array} value The selected values of the filter.
   */
  update = (id, value) => {
    const { filters } = this.props;

    const filter = filters.find(entry => entry.id === id);
    let initialValue;

    // In the case of a range filter, use the min and max.
    if (filter.type === FILTER_TYPE_RANGE) {
      initialValue = [filter.minimum, filter.maximum];
    }

    // Check if given value is the same as the initial value.
    if (isEqual(value, initialValue)) {
      this.remove(id);
      return;
    }

    this.add(id, value);
  }

  /**
   * @param {string} id The filter is to add.
   * @param {Array} value The values that changed.
   */
  add = (id, value) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [id]: value,
      },
    });
  }

  /**
   * @param {string} id The filter is to remove.
   */
  remove = (id) => {
    this.setState((prevState) => {
      // Separate the given id from the other set filters.
      const { [id]: removed, ...activeFilters } = prevState.filters;
      return { filters: activeFilters };
    });
  }

  updateDebounced = debounce(this.update, 50)

  reset = () => {
    this.initialFilters = buildInitialFilters(this.props.filters, {});
    this.setState({
      currentFilters: {},
      filters: {},
    });
  }

  save = () => {
    const { filters } = this.state;
    const parentFilters = Object.keys(filters).length ? filters : null;

    conductor.update(this.props.parentId, { filters: parentFilters });
    conductor.pop();
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
          const value = this.getFilterValue(filter.id);

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

          return (
            <Selector
              id={filter.id}
              key={filter.id}
              label={filter.label}
              values={filter.values}
            />
          );
        })}
        <ResetButton active={this.canReset} onClick={this.reset} />
        {ReactDOM.createPortal(
          <ApplyButton active={this.hasChanged} onClick={this.save} />,
          this.navigatorPosition
        )}
      </Fragment>
    );
  }
}

export default consume(FilterContent);
