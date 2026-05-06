import React from 'react';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { SCANNER_CAMERA } from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const edgeHeight = 45;
const edgeWidth = 35;
const edgeBorderWidth = 3;

const useStyles = makeStyles()(theme => ({
  root: {
    height: '90%',
    width: '100%',
    ':before,:after,>:before,>:after': {
      display: 'block',
      content: '""',
      width: edgeWidth,
      height: edgeHeight,
      position: 'absolute',
      borderStyle: 'solid',
      borderColor: themeColors.light,
    },
    ':before': {
      top: theme.spacing(8),
      left: theme.spacing(4),
      borderWidth: `${edgeBorderWidth}px 0 0 ${edgeBorderWidth}px`,
    },
    ':after': {
      top: theme.spacing(8),
      right: theme.spacing(4),
      borderWidth: `${edgeBorderWidth}px ${edgeBorderWidth}px 0 0`,
    },
    '>:before': {
      bottom: theme.spacing(8),
      left: theme.spacing(4),
      borderWidth: `0 0 ${edgeBorderWidth}px ${edgeBorderWidth}px`,
    },
    '>:after': {
      bottom: theme.spacing(8),
      right: theme.spacing(4),
      borderWidth: `0 ${edgeBorderWidth}px ${edgeBorderWidth}px 0`,
    },
  },
}));

/**
 * @returns {JSX.Element}
 */
const CameraOverlay = () => {
  const { classes } = useStyles();

  return (
    <SurroundPortals portalName={SCANNER_CAMERA}>
      <div className={classes.root}>
        <div />
      </div>
    </SurroundPortals>
  );
};

export default CameraOverlay;
