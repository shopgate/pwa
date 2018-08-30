import React, { Component } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import Sort from './components/Sort';
import FilterButton from './components/FilterButton';
// import FilterChips from './components/FilterChips';
import styles from './style';

/**
 * The Filter bar component.
 */
class Content extends Component {
  static propTypes = {
    componentUpdated: PropTypes.func.isRequired,
  };

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
        {/* <FilterChips currency={currency} /> */}
      </section>
    );
  }
}

export default Content;
