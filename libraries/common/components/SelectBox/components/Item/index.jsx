import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import I18n from '../../../I18n';
import { item } from './style';

/**
 * The SelectBoxItem component.
 * @param {Object} props The components props.
 * @returns {JSX}
 */
class SelectBoxItem extends Component {
  static propTypes = {
    handleSelectionUpdate: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    wrapper: PropTypes.func.isRequired,
    classNames: PropTypes.objectOf(PropTypes.string),
    forwardedRef: PropTypes.func,
  };

  static defaultProps = {
    forwardedRef: null,
    classNames: {},
  };

  /**
   * Calls the handleSelectionUpdate prop and prevents further events.
   */
  handleSelectionUpdate = () => {
    this.props.handleSelectionUpdate(this.props.value);
  };

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    const Wrapper = this.props.wrapper;
    const { selectItem, selectItemSelected } = this.props.classNames;

    return (
      <li
        className={classNames(selectItem, item, {
          [selectItemSelected]: this.props.isSelected,
        })}
        onKeyUp={() => { }}
        onClick={this.handleSelectionUpdate}
        data-test-id={this.props.label}
        role="menuitem"
        ref={this.props.forwardedRef}
        tabIndex={this.props.isSelected ? '0' : '-1'}
        aria-current={this.props.isSelected}
      >
        <Wrapper>
          <I18n.Text string={this.props.label} />
        </Wrapper>
      </li>
    );
  }
}

export default SelectBoxItem;
