import React, { Component } from 'react';
import PropTypes from 'prop-types';
import colors from 'Styles/colors';
import Content from './components/Content';
import styles from './style';

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
    // Chcek if newly set filters came in.
    const hasFilters = nextProps.filters !== null && Object.keys(nextProps.filters).length > 0;

    this.setState({
      active: hasFilters,
    });
  }

  /**
   * @param {Object} nextProps The next set of component props.
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
      background: active ? colors.accent : colors.background,
      color: active ? colors.accentContrast : 'inherit',
    };
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <section className={styles.container}>
        <div
          className={styles}
          data-test-id="filterBar"
          style={this.style}
        >
          <Content />
        </div>
      </section>
    );
  }
}

export default FilterBar;
