/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Returns a translation and replaces placeholder with children output.
 * It is possible to either pass JSX components or plain strings as replacement for
 * the translation keys.
 * To use JSX components as replacements, use a I18n.Placeholder component
 * and pass the JSX nodes as children.
 * @param {Object} props The component props.
 * @param {Object} props.string The string to translate.
 * @param {Array} props.children Children to use as placeholders. Must be one of the components
 *                               provided by I18n.
 * @param {string} props.className Additional classes to append to the translated wrapper element.
 * @param {Object} context The component context.
 * @returns {JSX} The translated string as JSX component.
 */
const Translate = ({ string, children, params, className }, context) => {
  if (typeof string !== 'string') {
    return string;
  }

  if (!context.i18n) {
    return <span className={className}>{string}</span>;
  }

  const { __ } = context.i18n();
  // First replace every occurence of a translation key with a separator.
  const separator = '__%S%__';
  const childrenArray = React.Children.toArray(children);

  const values = childrenArray.reduce((obj, child) => (child.props && child.props.forKey ? {
    ...obj,
    [child.props.forKey]: separator,
  } : obj), { ...params });

  // Split the tokenized string at the separators.
  const stringParts = __(string, values).split(separator);

  // Now create a new array containing the separated chunks of the text and merge the substitutions.
  const formatted = stringParts.reduce((result, text, index) => [
    ...result,
    text,
    childrenArray[index],
  ], []);

  return (
    <span className={className}>{formatted}</span>
  );
};

Translate.propTypes = {
  string: PropTypes.node.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  params: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.array,
  ]),
};

Translate.defaultProps = {
  children: null,
  className: '',
  params: {},
};

Translate.contextTypes = {
  i18n: PropTypes.func,
};

export default Translate;
