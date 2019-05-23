import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import styles from './style';

/**
 * The Headline component.
 * @param {string} props The component props.
 * @returns {JSX}
 */
const Headline = ({ tag: Tag, style, text }) => (
  text.length ? <Tag className={styles} style={style} data-test-id="Headline"><I18n.Text string={text} /></Tag> : null
);

Headline.propTypes = {
  style: PropTypes.shape(),
  tag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
  text: PropTypes.string,
};

Headline.defaultProps = {
  style: null,
  tag: 'h2',
  text: '',
};

export default Headline;
