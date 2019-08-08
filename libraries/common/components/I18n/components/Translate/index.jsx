import React from 'react';
import PropTypes from 'prop-types';
import { renderToString } from 'react-dom/server';
import { logger } from '@shopgate/pwa-core';
import { i18n } from '@shopgate/engage/core';

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
 * @param {Function} [props.transform] Input a function to modify the resulting string.
 * @returns {JSX} The translated string as JSX component.
 */
const Translate = ({
  string,
  children,
  params,
  className,
  role,
  transform,
}) => {
  if (typeof string !== 'string' || string.length === 0) {
    return string;
  }

  if (!i18n.ready) {
    return <span className={className} role={role}>{string}</span>;
  }

  // When the input string is malformed, return the original string rather than raising an error.
  let formatted = string;

  try {
    // First replace every occurrence of a translation key with a separator.
    const separator = '__%S%__';
    const childrenArray = React.Children.toArray(children);

    const values = childrenArray.reduce((obj, child) => (child.props && child.props.forKey ? {
      ...obj,
      [child.props.forKey]: separator,
    } : obj), { ...params });

    // Split the tokenized string at the separators.
    const stringParts = i18n.text(string, values).split(separator);

    // Create a new array containing the separated chunks of the text and merge the substitutions.
    // The result can be an array with multiple strings and will be joined together.
    formatted = stringParts.reduce((result, text, index) => [
      ...result,
      text,
      childrenArray[index],
    ], []);
  } catch (e) {
    logger.error('i18n error for string %s', string, e);
  }

  return (
    <span className={className} role={role}>
      {!transform ? formatted : transform(renderToString(formatted))}
    </span>
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
  role: PropTypes.string,
  transform: PropTypes.func,
};

Translate.defaultProps = {
  children: null,
  className: '',
  params: {},
  role: null,
  transform: null,
};

export default Translate;
