import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import event from '@shopgate/pwa-core/classes/Event';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/pwa-core/constants/AppEvents';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import I18n from '@shopgate/pwa-common/components/I18n/';
import Input from '@shopgate/pwa-common/components/Input/';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  SCANNER_ICON_BEFORE,
  SCANNER_ICON,
  SCANNER_ICON_AFTER,
} from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
import SearchIcon from '@shopgate/pwa-ui-shared/icons/MagnifierIcon';
import BarcodeScannerIcon from '@shopgate/pwa-ui-shared/icons/BarcodeScannerIcon';
import { router } from '@virtuous/conductor';
import SuggestionList from './components/SuggestionList';
import connect from './connector';
import styles from './style';

const SUGGESTIONS_MIN = 1;

/**
 * The SearchField component.
 */
class SearchField extends Component {
  static propTypes = {
    fetchSuggestions: PropTypes.func.isRequired,
    openScanner: PropTypes.func.isRequired,
    pageId: PropTypes.string.isRequired,
    submitSearch: PropTypes.func.isRequired,
    name: PropTypes.string,
    query: PropTypes.string,
    showScannerIcon: PropTypes.bool,
  };

  static defaultProps = {
    showScannerIcon: true,
    name: 'search',
    query: '',
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
   * Creates a new search field instance.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      bottomHeight: 0,
      query: this.props.query || '',
    };

    this.input = null;
    this.onBlurTimeout = null;
  }

  /**
   * Adds callback for keyboardWillChange.
   */
  componentDidMount() {
    registerEvents([EVENT_KEYBOARD_WILL_CHANGE]);
    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
  }

  /**
   * Removing callback for keyboardWillChange.
   */
  componentWillUnmount() {
    event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
    clearTimeout(this.onBlurTimeout);
  }

  /**
   * Sets a reference to the input fields DOM element.
   * @param {HTMLElement} ref The reference.
   */
  setInputRef = (ref) => {
    this.input = ref;
  };

  /**
   * Handler for keyboardWillChange event.
   * @param {Object} props Props.
   * @param {number} props.overlap Current overlap.
   * @type {Function}
   */
  handleKeyboardChange = ({ overlap }) => {
    this.setState({
      bottomHeight: overlap,
    });
  };

  /**
   * @param {Event} event The event.
   */
  reset = () => {
    setTimeout(() => {
      /*
       * Delay the execution of the state change until the next cycle
       * to give pending click events a chance to run.
       */
      this.setState({
        query: '',
        focused: false,
      });
    }, 0);
  }

  /**
   * @param {string} value The updated value.
   */
  update = (value) => {
    const query = value.trim();
    this.fetchSuggestions(query);
    this.setState({ query });
  };

  /**
   * Handles changes to the focus of the input element.
   * @param {boolean} focused Whether the element currently became focused.
   */
  handleFocusChange = (focused) => {
    clearTimeout(this.onBlurTimeout);
    this.onBlurTimeout = !focused ?
      setTimeout(() => {
        /*
         * Delay the execution of the state change until the next cycle
         * to give pending click events a chance to run.
         */
        this.setState({ focused });
      }, 200) : this.setState({ focused });
  };

  /**
   * Handles the form submit event.
   * @param {Object} e The event object.
   * @param {string} searchQuery Defaults to query in state.
   */
  handleSubmit = (e, searchQuery) => {
    e.preventDefault();

    const query = searchQuery || this.state.query;

    if (!query) {
      return;
    }

    router.update(this.props.pageId, { query });

    this.setState({ focused: false }, () => {
      /**
       * "submitSearch" might cause a component unmount. So we take care that the state update
       * happens before to avoid errors about state updates on unmounted components.
       */
      this.input.blur();
      this.props.submitSearch(query);
    });
  };

  /**
   * Renders the hint element.
   * @return {JSX}
   */
  renderLabelElement = () => (
    <label
      htmlFor={this.props.name}
      className={styles.label}
    >
      <div className={styles.icon}>
        <SearchIcon />
      </div>
      {!this.state.query.length && <I18n.Text string="search.label" />}
    </label>
  );

  /**
   * Renders the cancel button.
   * @return {JSX}
   */
  renderCancelButton = () => (
    <button
      className={classNames(styles.button, {
        [styles.hidden]: !this.state.focused,
      })}
      onClick={this.reset}
      type="button"
    >
      <I18n.Text string="search.cancel" />
    </button>
  );

  /**
   * Renders the input field.
   * @return {JSX}
   */
  renderInputField = () => {
    const classes = classNames(styles.input, {
      [styles.inputWithScannerIcon]: this.props.showScannerIcon && !this.state.focused,
    });
    return (
      <Input
        autoComplete={false}
        className={classes}
        onFocusChange={this.handleFocusChange}
        onChange={this.update}
        onSubmit={this.handleSubmit}
        value={this.state.query}
        setRef={this.setInputRef}
        type="search"
      />
    );
  }

  /**
   * Renders the scanner icon
   * @returns {JSX}
   */
  renderScannerIcon = () => {
    if (!this.props.showScannerIcon || this.state.focused) {
      return null;
    }

    return (
      <Fragment>
        <Portal name={SCANNER_ICON_BEFORE} />
        <Portal name={SCANNER_ICON}>
          <button className={styles.scannerIcon} onClick={this.props.openScanner} type="button" aria-hidden>
            <BarcodeScannerIcon />
          </button>
        </Portal>
        <Portal name={SCANNER_ICON_AFTER} />
      </Fragment>
    );
  }

  /**
   * Renders the text field.
   * @return {JSX}
   */
  render() {
    const { focused } = this.state;

    return (
      <div data-test-id="SearchField">
        <div className={styles.container}>
          <div className={styles.inputWrapper}>
            <form onSubmit={this.handleSubmit} action=".">
              {this.renderLabelElement()}
              {this.renderInputField()}
              {this.renderScannerIcon()}
            </form>
          </div>
          <div>
            {this.renderCancelButton()}
          </div>
        </div>
        {focused && <div className={styles.overlay} />}
        <SuggestionList
          visible={focused}
          searchPhrase={this.state.query}
          onClick={this.handleSubmit}
          bottomHeight={this.state.bottomHeight}
        />
      </div>
    );
  }
}

export default connect(SearchField);
