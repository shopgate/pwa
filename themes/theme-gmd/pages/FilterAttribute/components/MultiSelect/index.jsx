import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import Attribute from '../Attribute';
import Item from '../Item';
import ClearButton from '../ClearButton';

/**
 * The Filter MultiSelect component.
 */
class MultiSelect extends Component {
  static propTypes = {
    mergeTemporaryFilters: PropTypes.func.isRequired,
    removeTemporaryFilter: PropTypes.func.isRequired,
    temporaryFilters: PropTypes.shape().isRequired,
    currentAttribute: PropTypes.shape(),
  };

  static defaultProps = {
    currentAttribute: null,
  };

  /**
   * Updates the current filter options selection.
   * @param {string} attributeId An attribute id.
   * @param {string} valueId A string containing the selected value.
   * @param {string} valueLabel The human readable value.
   */
  handleSelection = (attributeId, valueId, valueLabel) => {
    const { currentAttribute, temporaryFilters } = this.props;

    // Get the temporary filters for this particular attribute.
    const tempFilters = temporaryFilters[currentAttribute.id] || {};

    // Get the values inside the temporary filter.
    let { values = [], valueLabels = [] } = tempFilters;

    /**
     * We need to find the index of the value so that we know which item to
     * remove from the temporary filter.
     */
    const valueIndex = values.indexOf(valueId);
    const valueLabelIndex = valueLabels.indexOf(valueLabel);

    if (valueIndex > -1) {
      this.props.removeTemporaryFilter(attributeId, valueIndex, valueLabelIndex);
    } else {
      // Add to selection.
      values = [...values, valueId];
      valueLabels = [...valueLabels, valueLabel];

      this.props.mergeTemporaryFilters({
        [currentAttribute.id]: {
          label: currentAttribute.label,
          source: currentAttribute.source,
          type: currentAttribute.type,
          values,
          valueLabels,
        },
      });
    }
  };

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    if (!this.props.currentAttribute) {
      return <View />;
    }

    const tempFilter = this.props.temporaryFilters[this.props.currentAttribute.id] || {};
    const activeValues = tempFilter.values || [];
    const { currentAttribute } = this.props;

    return (
      <Fragment>
        <Attribute>
          {currentAttribute.values.map(value => (
            <Item
              key={value.id}
              label={value.label}
              value={value.id}
              onClick={() => this.handleSelection(currentAttribute.id, value.id, value.label)}
              checked={activeValues.includes(value.id)}
            />
          ))}
        </Attribute>
        <ClearButton disabled={!activeValues.length} currentAttribute={currentAttribute} />
      </Fragment>
    );
  }
}

export default MultiSelect;
