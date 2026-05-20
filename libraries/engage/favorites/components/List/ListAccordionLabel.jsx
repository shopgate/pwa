import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  title: {
    flex: 1,
  },
});

/**
 * Favorite List Accordion Label component
 * @param {string} title The label name
 * @return {JSX.Element}
 */
const ListAccordionLabel = ({
  title,
}) => {
  const { classes } = useStyles();

  return (
    <span className={classes.title}>
      {title}
    </span>
  );
};

ListAccordionLabel.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ListAccordionLabel;
