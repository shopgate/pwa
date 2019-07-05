import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import EmbeddedMedia from '../EmbeddedMedia';
import parseHTML from '../../helpers/html/parseHTML';

/**
 * HtmlSanitizer component.
 */
class HtmlSanitizer extends Component {
  static propTypes = {
    children: PropTypes.string,
    className: PropTypes.string,
    decode: PropTypes.bool,
    processStyles: PropTypes.bool,
    settings: PropTypes.shape(),
    wrapper: PropTypes.func,
  };

  static defaultProps = {
    children: '',
    className: null,
    decode: false,
    processStyles: false,
    settings: {},
    wrapper: EmbeddedMedia,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.htmlContainer = React.createRef();
  }

  /**
   * Registers the event handler for when the user taps inside the html content.
   */
  componentDidMount() {
    this.htmlContainer.current.addEventListener('click', this.handleTap, true);
    embeddedMedia.add(this.htmlContainer.current);
  }

  /**
   * Only update if the HTML changed.
   * @param {Object} nextProps The next props for the component.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  /**
   * Updates embedded media within the html container.
   */
  componentDidUpdate() {
    embeddedMedia.add(this.htmlContainer.current);
  }

  /**
   * Removes the event handler.
   */
  componentWillUnmount() {
    this.htmlContainer.current.removeEventListener('click', this.handleTap, true);
    embeddedMedia.remove(this.htmlContainer.current);
  }

  /**
   * If the user tapped a link element, prevent the default behavior.
   * @param {Object} event The touchstart event.
   */
  handleTap = (event) => {
    const linkTag = event.target.closest('a');

    if (linkTag) {
      const {
        attributes: {
          href: { value: href = '' } = {},
          target: { value: target = '' } = {},
        } = {},
      } = linkTag;

      if (href) {
        event.preventDefault();
        this.props.settings.handleClick(href, target);
      }
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const innerHTML = {
      __html: parseHTML(
        this.props.children,
        this.props.decode,
        this.props.settings,
        this.props.processStyles
      ),
    };

    const { wrapper: Wrapper } = this.props;

    return (
      <Wrapper>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={innerHTML}
          ref={this.htmlContainer}
          className={this.props.className}
        />
      </Wrapper>
    );
  }
}

export default HtmlSanitizer;
