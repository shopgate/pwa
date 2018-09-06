import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getTranslator,
  getPriceFormatter,
  getDateFormatter,
  getTimeFormatter,
  getNumberFormatter,
} from '../../../../helpers/i18n';

/**
 * A React component that provides child components with i18n features.
 * @returns {React.Component}
 */
export default class I18nProvider extends Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    locales: PropTypes.shape().isRequired,
    children: PropTypes.node,
  };

  static childContextTypes = {
    i18n: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  /**
   * Provides context for child components.
   * @returns {Object}
   */
  getChildContext() {
    return {
      i18n: this.getI18nInstance,
    };
  }

  /**
   * Gets a shortcut to i18n functionality with preset language.
   * @returns {Object}
   */
  getI18nInstance = () => {
    const { locales, lang } = this.props;

    return {
      __: getTranslator(locales, lang),
      _p: getPriceFormatter(lang),
      _d: getDateFormatter(lang),
      _t: getTimeFormatter(lang),
      _n: getNumberFormatter(lang),
    };
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { children } = this.props;

    return children
      ? React.cloneElement(children)
      : null;
  }
}
