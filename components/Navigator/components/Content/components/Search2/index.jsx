import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { UIEvents } from '@shopgate/pwa-core';
import styles from './style';
import transition from './transition';

/**
 * The NavigatorSearch compo0nent.
 */
class NavigatorSearch extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
  }

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * 
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  /**
   * 
   * @param {*} nextProps 
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.inputField.current.focus();
    }
  }

  handleFocus = () => {
    this.inputField.current.selectionStart = this.props.query.length;
    this.inputField.current.selectionEnd = this.props.query.length;
  };

  /**
   * Handles blur events on the input element.
   */
  handleOverlayClick = () => {
    UIEvents.emit('UI_NAVIGATOR_SEARCH_FIELD', false);
  };

  /**
   * @return {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const placeholder = __('search.placeholder');

    return (
      <Transition in={this.props.active} timeout={150}>
        {state => (
          <Fragment>
            <form
              className={styles.container}
              data-test-id="Search"
              onSubmit={this.handleSubmit}
              style={transition[state]}
            >
              <input
                className={styles.input}
                onBlur={this.handleBlur}
                onChange={this.handleInput}
                onFocus={this.handleFocus}
                placeholder={placeholder}
                ref={this.inputField}
                type="search"
                value=""
              />
              <div
                aria-hidden
                className={styles.overlay}
                onClick={this.handleOverlayClick}
                role="button"
              />
            </form>
            {/* <SearchSuggestions phrase={this.state.inputValue} /> */}
          </Fragment>
      )}
      </Transition>
    );
  }
}

export default NavigatorSearch;
