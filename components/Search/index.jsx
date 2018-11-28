import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { UIEvents } from '@shopgate/pwa-core';
import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import AppBar from './components/AppBar';
import Backdrop from './components/Backdrop';
import Suggestions from './components/Suggestions';
import { TOGGLE_SEARCH } from './constants';
import connect from './connector';
import styles from './style';

const SUGGESTIONS_MIN = 2;
const DEFAULT_QUERY = '';

/**
 * The Search component.
 */
class Search extends Component {
  static propTypes = {
    fetchSuggestions: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.fieldRef = React.createRef();
    this.state = {
      query: DEFAULT_QUERY,
      visible: false,
    };

    UIEvents.on(TOGGLE_SEARCH, this.toggle);
  }

  /**
   * When opened, focus the search field and set the initial field value.
   */
  componentDidUpdate() {
    if (this.state.visible) {
      this.fieldRef.current.value = this.state.query;
      this.fieldRef.current.focus();
    }
  }

  /**
   * Close the search.
   */
  close = () => {
    this.toggle(false);
  }

  /**
   * @param {boolean} visible The next visible state.
   */
  toggle = (visible = true) => {
    const { query } = getCurrentRoute();
    const searchQuery = query.s || this.state.query;

    this.setState({
      query: searchQuery,
      visible,
    });
  }

  /**
   * @param {Event} event The event.
   */
  reset = () => {
    this.fieldRef.current.value = DEFAULT_QUERY;
    this.setState({ query: DEFAULT_QUERY });
  }

  /**
   * @param {Event} event The event.
   */
  update = (event) => {
    this.fetchSuggestions(event.target.value);
    this.setState({ query: event.target.value });
  };

  /**
   * Fetch the search suggestions, debounced to reduce the request amount.
   */
  fetchSuggestions = debounce((query) => {
    if (query.length > SUGGESTIONS_MIN) {
      this.props.fetchSuggestions(query);
    }
  }, 200, { maxWait: 400 });

  /**
   * @param {Event} event The event.
   */
  fetchResults = (event) => {
    const query = event.target.value || this.state.query;
    event.preventDefault();

    if (query.length === 0) {
      return;
    }

    this.setState({
      query: '',
      visible: false,
    });
    this.props.navigate(`/search?s=${query}`);
  }

  /**
   * @param {MouseEvent} event The event of the click.
   */
  handleClick = (event) => {
    event.preventDefault();
    UIEvents.emit(TOGGLE_SEARCH, false);
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { query, visible } = this.state;

    if (!visible) {
      return null;
    }

    return (
      <div className={styles}>
        <AppBar
          close={this.close}
          reset={this.reset}
          onInput={this.update}
          onEnter={this.fetchResults}
          fieldRef={this.fieldRef}
        />
        <Backdrop onClick={this.close} />
        {query.length > SUGGESTIONS_MIN && (
          <Suggestions onClick={this.fetchResults} searchPhrase={query} />
        )}
      </div>
    );
  }
}

export default connect(Search);
