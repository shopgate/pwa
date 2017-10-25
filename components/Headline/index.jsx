/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The headline component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Headline = (props) => {
  const className = props.small ? styles.small : styles.large;
  const Component = props.small ? 'h2' : 'h1';

  const hasContent = props.children || (props.text && props.text.length);

  const content = props.children || <I18n.Text string={props.text} />;

  return hasContent ? <Component className={className}>{content}</Component> : null;
};

Headline.propTypes = {
  children: PropTypes.node,
  small: PropTypes.bool,
  text: PropTypes.string,
};

Headline.defaultProps = {
  children: null,
  small: false,
  text: null,
};

export default Headline;

