import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { NavigatorContext } from '../../../../context';
import styles from './style';
import transition from './transition';

/**
 * The NavigatorSearch component.
 */
class NavigatorSearch extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    toggleSearchField: PropTypes.func.isRequired,
  }

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.inputField = React.createRef();

    this.state = {
      value: props.query,
    };
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.inputField.current.focus();
    }

    if (this.state.value !== nextProps.query) {
      this.setState({
        value: nextProps.query,
      });
    }
  }

  /**
   * Marks the whole input on focus.
   */
  handleFocus = () => {
    this.inputField.current.selectionStart = 0;
    this.inputField.current.selectionEnd = this.state.value.length;
  };

  /**
   * Handles blur events on the input element.
   */
  disableField = () => {
    this.inputField.current.blur();
    this.props.toggleSearchField(false);
  };

  /**
   * Handles input events on the input element.
   * @param {SyntheticEvent} event An input event.
   */
  handleInput = (event) => {
    this.props.setSearchQuery(event.target.value);
  }

  /**
   * Disabled the search field and submits the search.
   * @param {SyntheticEvent} event An input event.
   */
  submitSearch = (event) => {
    event.preventDefault();
    this.props.toggleSearchField(false, true);
  }

  /**
   * @return {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const placeholder = __('search.placeholder');

    return (
      <Transition in={this.props.active} timeout={0}>
        {state => (
          <div
            className={styles.container}
            style={transition[state]}
          >
            <form
              className={styles.form}
              data-test-id="Search"
              onSubmit={this.submitSearch}
            >
              <input
                className={styles.input}
                onChange={this.handleInput}
                onFocus={this.handleFocus}
                placeholder={placeholder}
                ref={this.inputField}
                type="search"
                value={this.state.value}
              />
            </form>
            <div
              aria-hidden
              className={styles.overlay}
              onClick={this.disableField}
              role="button"
            />
          </div>
        )}
      </Transition>
    );
  }
}

export default () => (
  <NavigatorContext.Consumer>
    {({
      searchField, searchQuery, setSearchQuery, toggleSearchField,
    }) => (
      <NavigatorSearch
        active={searchField}
        query={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleSearchField={toggleSearchField}
      />
    )}
  </NavigatorContext.Consumer>
);
