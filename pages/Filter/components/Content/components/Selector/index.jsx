import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import Item from '../Item';
import ValueButton from './components/ValueButton';
import Toggle from './components/Toggle';
import Selected from './components/Selected';
import * as styles from './style';

/**
 * The selector component.
 */
class Selector extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    multi: PropTypes.bool,
    onChange: PropTypes.func,
    selected: PropTypes.node,
  };

  static defaultProps = {
    multi: false,
    onChange() { },
    selected: null,
  };

  state = {
    selected: this.props.selected || [],
  };

  /**
   * @param {Object} nextProps The new incoming props.
   */
  componentWillReceiveProps({ selected }) {
    if (selected !== this.state.selected) {
      this.setState({ selected });
    }
  }

  /**
   * @param {SyntheticEvent} event The button click event.
   */
  handleClick = (event) => {
    const { value } = event.target;
    const { selected } = this.state;
    const { id, multi, onChange } = this.props;
    let newSelected = [...selected, value];

    // If in single select mode, only allow one selected value.
    if (!multi && selected.length === 1) {
      newSelected = [value];
    }

    // If the clicked value was already selected, remove it again.
    if (selected.includes(value)) {
      newSelected = selected.filter(item => item !== value);
    }

    // Set it if it wasn't selected already.
    this.setState({ selected: newSelected });
    onChange(id, newSelected);
  }

  /**
   * @param {Object} props The send render props.
   * @return {JSX}
   */
  renderLabel = (props) => {
    const { label, values } = this.props;
    const { selected } = this.state;

    return (
      <Toggle
        {...props}
        label={label}
        selected={<Selected values={values} selected={selected} />}
      />
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { values, id, label } = this.props;
    const { selected } = this.state;

    return (
      <Item>
        <Accordion
          renderLabel={this.renderLabel}
          testId={id}
          handleLabel={i18n.text('filter.filter_by', { label })}
        >
          <div className={styles.content}>
            {values.map(value => (
              <ValueButton
                key={value.id}
                id={value.id}
                label={value.label}
                isActive={(selected && selected.includes(value.id))}
                onClick={this.handleClick}
              />
            ))}
          </div>
        </Accordion>
      </Item>
    );
  }
}

export default Selector;
