import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n, Ellipsis, Typography } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  title: {
    lineHeight: themeConfig.typography.lineHeight,
    paddingBottom: theme.spacing(1),
    marginTop: '-.25em',
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Title = ({ title }) => {
  const { classes } = useStyles();

  if (!title) {
    return null;
  }

  return (
    <Typography variant="h3" component="div" className={classes.title} id="basicDialogTitle" role="heading" aria-level="2">
      <Ellipsis rows={3}>
        {typeof title === 'string' ? <I18n.Text string={title} /> : title}
      </Ellipsis>
    </Typography>
  );
};

Title.propTypes = {
  title: PropTypes.string,
};

Title.defaultProps = {
  title: null,
};

export default memo(Title);
