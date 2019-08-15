import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardConsumer } from '@shopgate/engage/components';
import List from './components/List';
import styles from './style';

/**
 * The Suggestions component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Suggestions = ({ onClick, searchPhrase }) => (
  <KeyboardConsumer>
    {({ overlap }) => (
      <section className={styles} style={{ paddingBottom: overlap }}>
        <List onClick={onClick} searchPhrase={searchPhrase} />
      </section>
    )}
  </KeyboardConsumer>
);

Suggestions.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
};

export default Suggestions;
