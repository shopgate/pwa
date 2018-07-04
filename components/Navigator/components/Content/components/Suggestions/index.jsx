import React from 'react';
import PropTypes from 'prop-types';
import Backdrop from './components/Backdrop';
import List from './components/List';
import inject from './injector';
import styles from './style';

/**
 * The Suggestions component.
 * @param {boolean} props.isVisible Whether or not the component should be shown.
 * @return {JSX}
 */
const Suggestions = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <section className={styles}>
      <Backdrop />
      <List />
    </section>
  );
};

Suggestions.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default inject(Suggestions);
