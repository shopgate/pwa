import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import conductor from '@virtuous/conductor';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  FILTER_PRICE_RANGE,
  FILTER_PRICE_RANGE_AFTER,
  FILTER_PRICE_RANGE_BEFORE,
} from '@shopgate/pwa-common-commerce/filter/constants/Portals';
import { FILTER_TYPE_RANGE, FILTER_TYPE_MULTISELECT } from '@shopgate/pwa-common-commerce/filter/constants';
import { PORTAL_NAVIGATOR_BUTTON } from 'Components/Navigator/constants';
import PriceSlider from './components/PriceSlider';
import Selector from './components/Selector';
import ApplyButton from './components/ApplyButton';
import ResetButton from './components/ResetButton';
import buildInitialFilters from './helpers/buildInitialFilters';
import connect from './connector';

/**
 * The FilterContent component.
 */
class FilterContent extends PureComponent {
  static propTypes = {
    activeFilters: PropTypes.shape(),
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
  getFilterValue = (id) => {
    const value = this.state.filters[id]
      ? this.state.filters[id].value
      : this.initialFilters[id].value;

    return value.map(entry => entry.id || entry);
  }

  /**
   * @param {string} id The id of the filter to add.
   * @param {Array} value The selected values of the filter.
   */
  update = (id, value) => {
    const { filters } = this.props;

    const filter = filters.find(entry => entry.id === id);
    let initialValue = [];

    // In the case of a range filter, use the min and max.
    if (filter.type === FILTER_TYPE_RANGE) {
      initialValue = [filter.minimum, filter.maximum];
    }

    // Check if given value is the same as the initial value.
    if (isEqual(value, initialValue)) {
      this.remove(id);
      return;
    }

    let stateValue = value;

    if (Array.isArray(filter.values)) {
      // The value only contains a list of ids. Within the route state id and label is required.
      stateValue = value.map((valueId) => {
        const match = filter.values.find(entry => entry.id === valueId);

        return {
          id: match.id,
          label: match.label,
        };
      });
    }

    this.add(id, {
      id,
      type: filter.type,
      label: filter.label,
      value: stateValue,
      ...(filter.source && { source: filter.source }),
    });
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
    const { currentFilters, filters } = this.state;

    // Create a set of active filters by combining state and currentFilters.
    const activeFilters = {
      ...currentFilters,
      ...filters,
    };

    const newFilters = Object.keys(activeFilters).length ? activeFilters : null;

    conductor.update(this.props.parentId, { filters: newFilters });
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
          const portalProps = { filter };
          const value = this.getFilterValue(filter.id);

          if (filter.type === FILTER_TYPE_RANGE) {
            return (
              <Fragment key={filter.id}>
                <Portal name={FILTER_PRICE_RANGE_BEFORE} props={portalProps} />
                <Portal name={FILTER_PRICE_RANGE} props={portalProps}>
                  <PriceSlider
                    id={filter.id}
                    key={filter.id}
                    min={filter.minimum}
                    max={filter.maximum}
                    onChange={this.updateDebounced}
                    value={value}
                  />
                </Portal>
                <Portal name={FILTER_PRICE_RANGE_AFTER} props={portalProps} />
              </Fragment>
            );
          }

          return (
            <Selector
              id={filter.id}
              key={filter.id}
              label={filter.label}
              values={filter.values}
              multi={filter.type === FILTER_TYPE_MULTISELECT}
              onChange={this.update}
              selected={value}
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

export default connect(FilterContent);
