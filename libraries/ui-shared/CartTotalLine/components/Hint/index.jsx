import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  hint: {
    paddingLeft: theme.spacing(1),
    order: 5,
  },
}));

/**
 * The Hint component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Hint = ({ hint }) => {
  const { classes } = useStyles();

  if (hint === null) {
    return null;
  }

  return (
    <div className={classes.hint}>
      <I18n.Text string={hint} />
    </div>
  );
};

Hint.propTypes = {
  hint: PropTypes.string,
};

Hint.defaultProps = {
  hint: null,
};

export default Hint;
