import React from 'react';
import PropTypes from 'prop-types';
import { DefaultBar } from 'Components/AppBar/presets';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  outer: {
    backdropFilter: 'none',
  },
});

/**
 * The GalleryAppBar component.
 * @param {Object} props Component props.
 * @param {Function} props.goBack Back navigation handler.
 * @returns {JSX.Element}
 */
const GalleryAppBar = ({ goBack }) => {
  const { classes } = useStyles();

  return (
    <DefaultBar
      classes={{ outer: classes.outer }}
      backgroundColor="rgba(0, 0, 0, 0)"
      textColor="#fff"
      left={<AppBar.Icon key="left" icon={ArrowIcon} onClick={goBack} shadow />}
    />
  );
};

GalleryAppBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};

export default connect(GalleryAppBar);
