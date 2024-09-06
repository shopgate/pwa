import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import EmbeddedMedia from '../EmbeddedMedia';
import parseHTML from '../../helpers/html/parseHTML';
import connect from './connector';

/**
 * HtmlSanitizer component.
 */
class HtmlSanitizer extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    children: PropTypes.string,
    className: PropTypes.string,
    comfortCookiesAccepted: PropTypes.bool,
    decode: PropTypes.bool,
    processStyles: PropTypes.bool,
    settings: PropTypes.shape(),
    statisticsCookiesAccepted: PropTypes.bool,
    wrapper: PropTypes.func,
  };

  static defaultProps = {
    children: '',
    className: '',
    decode: false,
    processStyles: false,
    settings: {},
    wrapper: EmbeddedMedia,
    comfortCookiesAccepted: false,
    statisticsCookiesAccepted: false,
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
        if (this.props.settings.handleClick) {
          this.props.settings.handleClick(href, target);
        } else {
          this.props.navigate(href, target);
        }
      }
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const cookieConsentSettings = {
      comfortCookiesAccepted: this.props.comfortCookiesAccepted,
      statisticsCookiesAccepted: this.props.statisticsCookiesAccepted,
    };

    const innerHTML = {
      __html: parseHTML(
        this.props.children,
        this.props.decode,
        this.props.settings,
        this.props.processStyles,
        cookieConsentSettings
      ),
    };

    const { wrapper: Wrapper } = this.props;

    return (
      <Wrapper cookieConsentSettings={cookieConsentSettings}>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={innerHTML}
          ref={this.htmlContainer}
          className={classNames(this.props.className, 'common__html-sanitizer')}
        />
      </Wrapper>
    );
  }
}

HtmlSanitizer.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(HtmlSanitizer);
