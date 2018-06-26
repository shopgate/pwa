import React, { Component, Fragment } from 'react';
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
   * @param {SyntheticEvent} event A click event.
   */
  disableField = (event) => {
    event.preventDefault();
    this.props.toggleSearchField(false);
  };

  /**
   * Handles input events on the input element.
   * @param {SyntheticEvent} event An input event.
   */
  handleInput = (event) => {
    event.preventDefault();
    this.props.setSearchQuery(event.target.value);
  }

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
              onSubmit={this.disableField}
              style={transition[state]}
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
              <div
                aria-hidden
                className={styles.overlay}
                onClick={this.disableField}
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
