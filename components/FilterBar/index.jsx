import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Content from './components/Content';
import styles from './style';

const { colors } = themeConfig;

/**
 * The FilterBar component.
 */
class FilterBar extends Component {
  static propTypes = {
    filters: PropTypes.shape(),
  };

  static defaultProps = {
    filters: null,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      active: props.filters !== null,
    };
  }

  /**
   * Check for a new viewRef and update the scroll element.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    // Check if newly set filters came in.
    const hasFilters = nextProps.filters !== null && Object.keys(nextProps.filters).length > 0;

    this.setState({
      active: hasFilters,
    });
  }

  /**
   * @param {Object} nextProps The next props of the component.
   * @param {Object} nextState The next state of the component.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.active !== nextState.active;
  }

  /**
   * @returns {Object}
   */
  get style() {
    const { active } = this.state;
    return {
      background: active ? colors.accent : colors.light,
      color: active ? colors.accentContrast : colors.dark,
    };
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div className={styles} data-test-id="filterBar" style={this.style}>
        <Content />
      </div>
    );
  }
}

export default FilterBar;
