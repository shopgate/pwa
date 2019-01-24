import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Headline from 'Components/Headline';
import Item from '../Item';
import styles from '../../style';

/**
 * The SectionComponent.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Section = ({ children, title }) => {
  if (!children) {
    return null;
  }

  return (
    <Fragment>
      <Headline style={styles.headline} text={title} />
      <div className={styles.list}>
        {children}
      </div>
    </Fragment>
  );
};

Section.Item = Item;

Section.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

Section.defaultProps = {
  children: null,
  title: '',
};

export default Section;
