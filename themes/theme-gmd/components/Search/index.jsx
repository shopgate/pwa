import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { UIEvents } from '@shopgate/pwa-core';
import AppBar from './components/AppBar';
import Suggestions from './components/Suggestions';
import { TOGGLE_SEARCH } from './constants';
import connect from './connector';
import styles from './style';

const SUGGESTIONS_MIN = 2;

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
      query: '',
      visible: false,
    };

    UIEvents.on(TOGGLE_SEARCH, this.toggle);
  }

  /**
   * When opened, focus the search field.
   */
  componentDidUpdate() {
    if (this.state.visible) {
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
  toggle = (visible) => {
    this.setState({ visible });
  }

  /**
   * @param {Event} event The event.
   */
  reset = () => {
    this.setState({ query: '' });
  }

  /**
   * @param {Event} event The event.
   */
  update = (event) => {
    this.fetchSuggestions(event.target.value);
    this.setState({ query: event.target.value });
  };

  /**
   * Fetch the search suggestions, debounced by 1 second.
   */
  fetchSuggestions = debounce((query) => {
    if (query.length > SUGGESTIONS_MIN) {
      this.props.fetchSuggestions(query);
    }
  }, 1000);

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
      <div className={styles.view}>
        <AppBar
          close={this.close}
          reset={this.reset}
          onInput={this.update}
          onEnter={this.fetchResults}
          fieldRef={this.fieldRef}
        />
        {query.length > SUGGESTIONS_MIN && (
          <Suggestions onClick={this.fetchResults} searchPhrase={query} />
        )}
      </div>
    );
  }
}

export default connect(Search);
