import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { router } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  FILTER_PRICE_RANGE,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_MULTISELECT,
  PriceSlider,
  buildInitialFilters,
  buildUpdatedFilters,
} from '@shopgate/engage/filter';
import { CloseBar } from 'Components/AppBar/presets';
import Selector from './components/Selector';
import ApplyButton from './components/ApplyButton';
import ResetButton from './components/ResetButton';
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
    const { value: initialValues } = this.initialFilters[id];
    let stateValue = value;

    if (initialValues.length === 0 && value.length === 0) {
      this.remove(id);
      return;
    }

    /**
     * When the filter value is set to be the initial value
     * then we do not consider that a change.
     */
    if (initialValues.length !== 0 && value.length !== 0) {
      if (initialValues.every((initial, i) => initial === value[i])) {
        this.remove(id);
        return;
      }
    }

    if (Array.isArray(filter.values)) {
      /**
       * The value only contains a list of ids.
       * Within the route state id and label is required.
       */
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

  // eslint-disable-next-line react/sort-comp
  updateDebounced = debounce(this.update, 50)

  /**
   * @param {string} id The filter is to add.
   * @param {Array} value The values that changed.
   */
  add = (id, value) => {
    this.setState(({ filters }) => ({
      filters: {
        ...filters,
        [id]: value,
      },
    }));
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

  reset = () => {
    this.initialFilters = buildInitialFilters(this.props.filters, {});
    this.setState({
      currentFilters: {},
      filters: {},
    });
  }

  save = () => {
    const { currentFilters, filters } = this.state;

    router.update(
      this.props.parentId,
      { filters: buildUpdatedFilters(currentFilters, filters) }
    );
    setTimeout(router.pop, 250);
  }

  /**
   * Renders the CloseBar.
   * @returns {JSX}
   */
  renderCloseBar = () => {
    const right = <ApplyButton key="right" active={this.hasChanged} onClick={this.save} />;
    return <CloseBar title="titles.filter" right={right} />;
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { filters } = this.props;

    if (!filters) {
      return this.renderCloseBar();
    }

    return (
      <Fragment>
        {this.renderCloseBar()}
        {filters.map((filter) => {
          const portalProps = { filter };
          const value = this.getFilterValue(filter.id);

          if (filter.type === FILTER_TYPE_RANGE) {
            return (
              <Fragment key={filter.id}>
                <SurroundPortals portalName={FILTER_PRICE_RANGE} portalProps={portalProps}>
                  <PriceSlider
                    id={filter.id}
                    key={filter.id}
                    min={filter.minimum}
                    max={filter.maximum}
                    onChange={this.updateDebounced}
                    value={value}
                  />
                </SurroundPortals>
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
      </Fragment>
    );
  }
}

export default connect(FilterContent);
