import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  body: {
    color: themeConfig.colors.shade6,
    flexGrow: 1,
    overflow: 'auto',
  },
});

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Content = ({ content }) => {
  const { classes } = useStyles();

  if (!content) {
    return null;
  }

  return (
    <div className={classes.body} id="basicDialogDesc">
      {content}
    </div>
  );
};

Content.propTypes = {
  content: PropTypes.node,
};

Content.defaultProps = {
  content: null,
};

export default memo(Content);
