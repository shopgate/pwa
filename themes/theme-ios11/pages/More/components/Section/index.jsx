import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Headline from 'Components/Headline';
import Item from '../Item';

const useStyles = makeStyles()(() => ({
  headline: {
    margin: '24px 20px 16px',
  },
  list: {
    margin: '0 20px 8px',
  },
}));

/**
 * Section component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const Section = ({ children, title }) => {
  const { classes } = useStyles();

  if (!children) {
    return null;
  }

  return (
    <>
      <Headline className={classes.headline} text={title} />
      <div className={classes.list} data-test-id="more-section-list">
        {children}
      </div>
    </>
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
