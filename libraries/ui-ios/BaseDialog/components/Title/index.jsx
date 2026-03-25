import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  title: {
    textAlign: 'center',
    fontWeight: 600,
  },
});

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
    <div className={classes.title} id="basicDialogTitle" role="heading" aria-level="2">
      <Ellipsis rows={3}>
        {typeof title === 'string' ? <I18n.Text string={title} /> : title}
      </Ellipsis>
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string,
};

Title.defaultProps = {
  title: null,
};

export default memo(Title);
