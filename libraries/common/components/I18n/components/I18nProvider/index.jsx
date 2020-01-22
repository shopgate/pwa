import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { logger } from '@shopgate/pwa-core/helpers';

/**
 * A React component that provides child components with i18n features.
 * @returns {React.Component}
 */
export default class I18nProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static childContextTypes = {
    i18n: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  /**
   * @inheritDoc
   */
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/prop-types
    if (this.props.lang || this.props.locales) {
      logger.warn(`===== I18nProvider deprecated =====\nI18nProvider and it's related components (@shopgate/pwa-common/component/I18n) or context types are deprecated and will be removed in @shopgate/engage v7.0.0.\nPlease use { i18n } from @shopgate/engage/core.\n===================================
      `);
    }
  }

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
  getI18nInstance = () => ({
    __: i18n.text,
    _p: i18n.price,
    _d: i18n.date,
    _t: i18n.time,
    _n: i18n.number,
  });

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
