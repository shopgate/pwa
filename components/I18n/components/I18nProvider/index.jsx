/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  getTranslator,
  getPriceFormatter,
  getDateFormatter,
  getTimeFormatter,
} from '../../../../helpers/i18n';

/**
 * A React component that provides child components with i18n features.
 * @returns {React.Component}
 */
export default class I18nProvider extends React.Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    locales: PropTypes.shape().isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  static childContextTypes = {
    i18n: PropTypes.func.isRequired,
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
