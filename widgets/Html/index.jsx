import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { history } from '@shopgate/pwa-common/helpers/router';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import variables from 'Styles/variables';
import parseHTML from '@shopgate/pwa-common/helpers/html/parseHTML';
import { handleYouTube } from '@shopgate/pwa-common/helpers/html/handleDOM';
import styles from './style';

/**
 * The custom HTML widget.
 */
class Html extends Component {
  /**
   * The widget properties.
   * @type {Object}
   */
  static propTypes = {
    settings: PropTypes.shape({
      defaultPadding: PropTypes.bool.isRequired,
      html: PropTypes.string.isRequired,
    }).isRequired,
  };

  /**
   * Get the escaped HTML from the props, remove and execute the scripts (if any) and put
   * it unescaped in the state.
   * @param {Object} props The component props.
   * @param {Object} context The component context.
   */
  constructor(props) {
    super(props);

    this.state = {
      html: this.html,
    };
  }

  /**
   * Registers the event handler for when the user taps inside the widget.
   */
  componentDidMount() {
    this.htmlContainer.addEventListener('click', this.handleTap, true);
    handleYouTube(this.htmlContainer);
  }

  /**
   * Update the component state when the props change.
   * @param {Object} nextProps The next props.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.settings.html !== this.props.settings.html) {
      this.setState({
        html: this.html,
      });
    }
  }

  /**
   * Only update if the HTML changed.
   * @param  {Object} nextProps The next props for the component.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.settings.html !== this.props.settings.html;
  }

  /**
   * Removes the event handler.
   */
  componentWillUnmount() {
    this.htmlContainer.removeEventListener('click', this.handleTap, true);
  }

  /**
   * Creates the HTML content for the component.
   * @return {string}
   */
  get html() {
    return parseHTML(this.props.settings.html, true, this.props.settings, true);
  }
  /**
   * If the user tapped a link element, prevent the default behaviour
   * and handle them via ParsedLink.
   * @param {Object} e The touchstart event.
   */
  handleTap = (e) => {
    const aTag = e.target.closest('a');

    if (aTag && aTag.attributes.href) {
      const href = aTag.attributes.href.value;
      const link = new ParsedLink(href);

      e.preventDefault();
      link.open(history);
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <div
        className={styles}
        dangerouslySetInnerHTML={{ __html: this.state.html }}
        ref={(element) => {
          this.htmlContainer = element;
        }}
        style={{
          ...(this.props.settings.defaultPadding && { padding: variables.gap.big }),
        }}
      />
    );
  }
}

export default Html;
