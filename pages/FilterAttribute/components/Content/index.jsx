import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FILTER_TYPE_SINGLE_SELECT } from '@shopgate/pwa-common-commerce/filter/constants';
import View from 'Components/View';
import MultiSelect from '../MultiSelect';
import SingleSelect from '../SingleSelect';
import connect from './connector';
import styles from './style';

/**
 * The Filter Attribute view component.
 */
class FilterAttribute extends Component {
  static propTypes = {
    mergeTemporaryFilters: PropTypes.func.isRequired,
    removeTemporaryFilter: PropTypes.func.isRequired,
    setFilterAttributeClosed: PropTypes.func.isRequired,
    setFilterAttributeOpened: PropTypes.func.isRequired,
    temporaryFilters: PropTypes.shape().isRequired,
    currentAttribute: PropTypes.shape(),
  };

  static defaultProps = {
    currentAttribute: null,
  };

  /**
   * Marks the filter page as open when entering the page.
   */
  componentDidMount() {
    this.props.setFilterAttributeOpened();
  }

  /**
   * Marks the filter page as closed when leaving the page.
   */
  componentWillUnmount() {
    this.props.setFilterAttributeClosed();
  }

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    if (!this.props.currentAttribute) {
      return <View />;
    }

    const { currentAttribute } = this.props;

    const SelectionComponent = currentAttribute.type === FILTER_TYPE_SINGLE_SELECT ?
      SingleSelect : MultiSelect;

    const props = {
      mergeTemporaryFilters: this.props.mergeTemporaryFilters,
      removeTemporaryFilter: this.props.removeTemporaryFilter,
      temporaryFilters: this.props.temporaryFilters,
      currentAttribute: this.props.currentAttribute,
    };
    return (
      <div className={styles} data-test-id="filterAttributes">
        <SelectionComponent {...props} />
      </div>
    );
  }
}

export default connect(FilterAttribute);
