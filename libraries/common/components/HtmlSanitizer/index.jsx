import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parseHTML from '../../helpers/html/parseHTML';

/**
 * HtmlSanitizer component.
 */
class HtmlSanitizer extends Component {
  static propTypes = {
    children: PropTypes.string,
    decode: PropTypes.bool,
    settings: PropTypes.shape(),
  };

  static defaultProps = {
    children: '',
    decode: false,
    settings: {},
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
    this.htmlContainer.current.addEventListener('touchstart', this.handleTap, true);
    this.htmlContainer.current.addEventListener('click', this.handleTap, true);
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
   * Removes the event handler.
   */
  componentWillUnmount() {
    this.htmlContainer.current.removeEventListener('touchstart', this.handleTap, true);
    this.htmlContainer.current.removeEventListener('click', this.handleTap, true);
  }

  /**
   * If the user tapped a link element, prevent the default behaviour.
   * @param {Object} event The touchstart event.
   */
  handleTap = (event) => {
    const aTag = event.target.closest('a');

    if (aTag && aTag.attributes.href) {
      event.preventDefault();
      const href = aTag.attributes.href.value;
      this.props.settings.handleClick(href);
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
        this.props.settings
      ),
    };

    return (
      <div dangerouslySetInnerHTML={innerHTML} ref={this.htmlContainer} />
    );
  }
}

export default HtmlSanitizer;
