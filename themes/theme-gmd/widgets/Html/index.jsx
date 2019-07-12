import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import variables from 'Styles/variables';
import parseHTML from '@shopgate/pwa-common/helpers/html/parseHTML';
import EmbeddedMedia from '@shopgate/pwa-common/components/EmbeddedMedia';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import styles from './style';
import connect from './connector';

/**
 * The custom HTML widget.
 */
class Html extends Component {
  /**
   * Creates the HTML content for the widget.
   * @param {Object} settings The settings of the widget.
   * @return {string}
   */
  static createHTML(settings) {
    return parseHTML(settings.html, true, settings, true);
  }

  /**
   * The widget properties.
   * @type {Object}
   */
  static propTypes = {
    navigate: PropTypes.func.isRequired,
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
  constructor(props, context) {
    super(props, context);

    this.state = {
      html: this.constructor.createHTML(this.props.settings),
    };
  }

  /**
   * Registers the event handler for when the user taps inside the widget.
   */
  componentDidMount() {
    this.htmlContainer.addEventListener('click', this.handleTap, true);
    embeddedMedia.add(this.htmlContainer);
  }

  /**
   * Update the component state when the props change.
   * @param {Object} nextProps The next props.
   */
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.settings, nextProps.settings)) {
      this.setState({
        html: this.constructor.createHTML(nextProps.settings),
      });
    }
  }

  /**
   * Only update if the HTML changed.
   * @param  {Object} nextProps The next props for the component.
   * @param  {Object} nextState The next state for the component.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.html !== nextState.html;
  }

  /**
   * Updates youtube iframes within the HTML widget.
   */
  componentDidUpdate() {
    embeddedMedia.add(this.htmlContainer);
  }

  /**
   * Removes the event handler.
   */
  componentWillUnmount() {
    this.htmlContainer.removeEventListener('click', this.handleTap, true);
    embeddedMedia.remove(this.htmlContainer);
  }

  /**
   * If the user tapped a link element, prevent the default behaviour
   * and handle them via ParsedLink.
   * @param {Object} e The touchstart event.
   */
  handleTap = (e) => {
    const aTag = e.target.closest('a');

    if (aTag) {
      const {
        attributes: {
          href: { value: href = '' } = {},
          target: { value: target = '' } = {},
        } = {},
      } = aTag;

      if (href) {
        e.preventDefault();
        this.props.navigate({
          pathname: href,
          ...target && { state: { target } },
        });
      }
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <EmbeddedMedia>
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
      </EmbeddedMedia>
    );
  }
}

export default connect(Html);

export { Html as UnwrappedHtml };
