import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  root: {
    color: 'var(--color-primary)',
  },
}));

/**
 * The manufacturer component.
 * @param {Object} props The component props.
 * @param {string} props.text The manufacturer name.
 * @param {string} [props.className] CSS classes.
 * @return {JSX}
 */
const Manufacturer = ({ className, text }) => {
  const { classes } = useStyles();

  return (
    <div className={`${classes.root} ${className} ui-shared__manufacturer`}>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

Manufacturer.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Manufacturer.defaultProps = {
  className: '',
};

export default Manufacturer;
