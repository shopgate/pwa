import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compareObjects } from '@shopgate/pwa-common/helpers/redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
// Import ViewSwitch from './components/ViewSwitch';
import Sort from './components/Sort';
import FilterButton from './components/FilterButton';
import FilterChips from './components/FilterChips';
import connect from './connector';
import styles from './style';

/**
 * The Filter bar component.
 */
class Content extends Component {
  static propTypes = {
    componentUpdated: PropTypes.func.isRequired,
    getFilters: PropTypes.func.isRequired,
    activeFilters: PropTypes.shape(),
  };

  static defaultProps = {
    activeFilters: {},
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
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { currency } = appConfig;

    return (
      <section>
        <div className={styles}>
          {/* <ViewSwitch /> */}
          <Sort />
          <FilterButton />
        </div>
        <FilterChips currency={currency} />
      </section>
    );
  }
}

export const UnwrappedFilterBarContent = Content;

export default connect(Content);
