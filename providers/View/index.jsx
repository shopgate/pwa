import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ViewContext } from 'Components/View/context';

/**
 * The ViewProvider component.
 */
class ViewProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      top: 0,
      bottom: 0,
      contentRef: { current: null },
      ariaHidden: false,
    };
  }

  /**
   * @returns {Object}
   */
  get providerContext() {
    return {
      ...this.state,
      set: this.set,
      setTop: this.setTop,
      setBottom: this.setBottom,
      setContentRef: this.setContentRef,
      setAriaHidden: this.setAriaHidden,
      getContentRef: this.getContentRef,
      scrollTop: this.scrollTop,
    };
  }

  /**
   * @param {number} value The new top value;
   */
  setTop = (value) => {
    this.set('top', value);
  }

  /**
   * @param {number} value The new bottom value;
   */
  setBottom = (value) => {
    this.set('bottom', value);
  }

  /**
   * @param {boolean} value The new aria hidden value;
   */
  setAriaHidden = (value) => {
    this.set('ariaHidden', value);
  }

  /**
   * @param {Object} ref A React reference to the page content wrapper.
   */
  setContentRef = (ref) => {
    this.set('contentRef', ref);
  }

  /**
   * @return {Object}
   */
  getContentRef = () => this.state.contentRef;

  /**
   * Scrolls the content ref to the top.
   * @param {number} [value=0] A number indicating the new scroll position of the content ref.
   */
  scrollTop = (value = 0) => {
    const { current } = this.state.contentRef;
    if (current) {
      current.scrollTop = value;
    }
  }

  /**
   * @param {string} property The state property to set.
   * @param {*} value The value to set.
   */
  set = (property, value) => {
    if (this.state[property] !== value) {
      this.setState({
        [property]: value,
      });
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <ViewContext.Provider value={this.providerContext}>
        {this.props.children}
      </ViewContext.Provider>
    );
  }
}

export default ViewProvider;
