import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { UIEvents } from '@shopgate/pwa-core';
import { SEARCH_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import AppBar from './components/AppBar';
import Backdrop from './components/Backdrop';
import Suggestions from './components/Suggestions';
import { TOGGLE_SEARCH, SEARCH_CLOSED } from './constants';
import connect from './connector';
import styles from './style';

const DEFAULT_QUERY = '';
const SUGGESTIONS_MIN = 1;

/**
 * The Search component.
 */
class Search extends Component {
  static propTypes = {
    fetchSuggestions: PropTypes.func.isRequired,
    historyPush: PropTypes.func.isRequired,
    historyReplace: PropTypes.func.isRequired,
    route: PropTypes.shape(),
  }

  static defaultProps = {
    route: null,
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
   * Removes the TOGGLE_SEARCH event listener on unmount.
   */
  componentWillUnmount() {
    UIEvents.off(TOGGLE_SEARCH, this.toggle);
  }

  /**
   * Fetch the search suggestions, debounced to reduce the request amount.
   */
  fetchSuggestions = debounce((query) => {
    if (query.length > SUGGESTIONS_MIN) {
      this.props.fetchSuggestions(query.trim());
    }
  }, 200, { maxWait: 400 });

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
    const { route } = this.props;

    if (!route) {
      return;
    }

    const { query } = route;

    const wasVisible = this.state.visible;

    this.setState(prevState => ({
      query: query.s || prevState.query,
      visible,
    }));

    if (wasVisible && !visible) {
      UIEvents.emit(SEARCH_CLOSED);
    }
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
    const query = event.currentTarget.value;
    this.fetchSuggestions(query);
    this.setState({ query });
  };

  /**
   * @param {Event} event The event.
   */
  fetchResults = (event) => {
    event.preventDefault();

    const searchQuery = (event.currentTarget.value || this.state.query).trim();

    if (searchQuery.length === 0) {
      return;
    }

    this.setState({
      query: DEFAULT_QUERY,
      visible: false,
    });

    const location = `/search?s=${encodeURIComponent(searchQuery)}`;
    const { route: { pattern, query } } = this.props;

    if (query.s === searchQuery) {
      return;
    }

    if (pattern === SEARCH_PATTERN) {
      this.props.historyReplace({ pathname: location });
    } else {
      this.props.historyPush({ pathname: location });
    }
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
        <Suggestions onClick={this.fetchResults} searchPhrase={query} />
      </div>
    );
  }
}

export default connect(Search);
