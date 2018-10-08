import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import Attribute from '../Attribute';
import Item from '../Item';
import ClearButton from '../ClearButton';

/**
 * The Filter SingleSelect view component.
 */
class SingleSelect extends Component {
  static propTypes = {
    mergeTemporaryFilters: PropTypes.func.isRequired,
    temporaryFilters: PropTypes.shape().isRequired,
    currentAttribute: PropTypes.shape(),
  };

  static defaultProps = {
    currentAttribute: null,
  };

  /**
   * Updates the current filter options selection.
   * @param {string} valueId The current selected attribute options.
   * @param {string} valueLabel The human readable value.
   */
  handleSelection = (valueId, valueLabel) => {
    const { currentAttribute } = this.props;
    this.props.mergeTemporaryFilters({
      [currentAttribute.id]: {
        label: currentAttribute.label,
        source: currentAttribute.source,
        type: currentAttribute.type,
        value: valueId,
        valueLabel,
      },
    });
  };

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    if (!this.props.currentAttribute) {
      return <View />;
    }

    const { currentAttribute } = this.props;
    const tempFilter = this.props.temporaryFilters[currentAttribute.id] || {};
    return (
      <Fragment>
        <Attribute>
          {currentAttribute.values.map(value => (
            <Item
              key={value.id}
              label={value.label}
              value={value.id}
              onClick={() => this.handleSelection(value.id, value.label)}
              checked={tempFilter.value === value.id}
              singleSelect
            />
          ))}
        </Attribute>
        <ClearButton disabled={!tempFilter.value} currentAttribute={currentAttribute} />
      </Fragment>
    );
  }
}

export default SingleSelect;
