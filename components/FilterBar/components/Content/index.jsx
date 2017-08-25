import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compareObjects } from '@shopgate/pwa-common/helpers/redux';
import I18n from '@shopgate/pwa-common/components/I18n';
import Chip from 'Components/Chip';
import { GRID_VIEW } from 'Pages/Category/constants';
import connect from './connector';
import Sort from '../Sort';
import ViewSwitch from '../ViewSwitch';
import styles from './style';

/**
 * The Filter bar component.
 */
class Content extends PureComponent {
  static propTypes = {
    componentUpdated: PropTypes.func.isRequired,
    getFilters: PropTypes.func.isRequired,
    activeFilters: PropTypes.shape(),
    commitTemporaryFilters: PropTypes.func,
    handleOpenFiltersView: PropTypes.func,
    removeTemporaryFilter: PropTypes.func,
  };

  static defaultProps = {
    activeFilters: {},
    commitTemporaryFilters: () => {},
    handleOpenFiltersView: () => {},
    removeTemporaryFilter: () => {},
    sort: null,
    viewMode: GRID_VIEW,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Called after mount. Sets up the scroll DOM elements.
   */
  componentDidMount() {
    this.props.getFilters();
  }

  /**
   * Called before the component receives new properties. Sets up the scroll DOM elements.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (!compareObjects(nextProps.activeFilters, this.props.activeFilters)) {
      this.props.getFilters();
    }
  }

  /**
   * Call parents' callback to trigger some re-calculation.
   */
  componentDidUpdate() {
    this.props.componentUpdated();
  }

  /**
   * Handles removal of a filter by clicking on a chip.
   * @param {string} id The filter Id
   * @param {number} index The filter index
   */
  handleFilterRemove = (id, index) => {
    this.props.removeTemporaryFilter(id, index);
    this.props.commitTemporaryFilters();
  };

  /**
   * Creates the chip elements that will be visible in the FilterBar.
   * @returns {Array} Array of react elements.
   */
  createFilterChips() {
    const { activeFilters } = this.props;

    if (!activeFilters) {
      return null;
    }

    /**
     * TODO: Remove context translation for currency and,
     * instead, get it from shop settings when available.
     */
    const { __ } = this.context.i18n();
    const currency = __('price.currency');
    const chips = [];

    Object.keys(activeFilters).forEach((key) => {
      const filter = activeFilters[key];

      if (filter.type === 'range') {
        chips.push(
          <Chip
            key={filter.label}
            onRemove={() => this.handleFilterRemove(key)}
            onClick={this.props.handleOpenFiltersView}
          >
            <I18n.Price price={filter.minimum / 100} currency={currency} fractions={false} />
            &nbsp;&mdash;&nbsp;
            <I18n.Price price={filter.maximum / 100} currency={currency} fractions={false} />
          </Chip>
        );
      } else if (filter.type === 'multiselect') {
        filter.values.forEach((value, index) => chips.push(
          <Chip
            key={`${filter.label}-${index + 1}`}
            onRemove={() => this.handleFilterRemove(key, index)}
            onClick={this.props.handleOpenFiltersView}
          >
            {`${filter.label}: ${value}`}
          </Chip>
        ));
      } else {
        chips.push(
          <Chip
            key={filter.label}
            onRemove={() => this.handleFilterRemove(key)}
            onClick={this.props.handleOpenFiltersView}
          >
            {`${filter.label}: ${filter.value}`}
          </Chip>
        );
      }
    });

    return chips;
  }

  /**
   * Returns whether filters are set or not.
   * @returns {boolean}
   */
  get hasFilters() {
    return !!Object.keys(this.props.activeFilters).length;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <div className={styles.wrapper}>
        <ViewSwitch />
        <Sort />
        {/*<button className={styles.button} onClick={this.props.handleOpenFiltersView}>
          <Ripple className={styles.filterButtonRipple} fill>
            <Grid component="div">
              <Grid.Item
                className={styles.filterButton}
                component="div"
              >
                <span className={styles.filterButtonLabel}>
                  <I18n.Text string="titles.filter" />
                </span>
              </Grid.Item>
              <Grid.Item component="div">
                <FilterIcon />
              </Grid.Item>
            </Grid>
          </Ripple>
        </button>*/}
        {/*<div className={styles.cardList}>
          {this.hasFilters &&
            <ChipLayout
              moreLabel="filter.more"
              handleMoreButton={this.props.handleOpenFiltersView}
            >
              {this.createFilterChips()}
            </ChipLayout>
          }
        </div>*/}
      </div>
    );
  }
}

export const UnwrappedFilterBarContent = Content;

export default connect(Content);
