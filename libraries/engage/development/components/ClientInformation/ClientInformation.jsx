import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { useLongPress } from '@shopgate/engage/core/hooks';
import { getClientInformation } from '@shopgate/engage/core/selectors';
import DevelopmentSettings from '../DevelopmentSettings';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'relative',
    textAlign: 'center',
    color: theme.palette.grey[500],
    fontSize: 12,
    paddingBottom: 20,
  },
  unselectable: {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  },
  deviceId: {
    wordBreak: ['keep-all', 'break-word'],
    hyphens: 'auto',
    padding: theme.spacing(0, 2),
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ClientInformation = () => {
  const { classes, cx } = useStyles();
  const [deviceIdVisible, setDeviceIdVisible] = useState(false);
  const [developmentSettingsVisible, setDevelopmentSettingsVisible] = useState(false);

  // Press handler to show the device ID
  const longPressAttrs = useLongPress(() => {
    if (!deviceIdVisible) {
      setDeviceIdVisible(true);
    } else {
      setDevelopmentSettingsVisible(true);
    }
  }, { threshold: 5000 });

  const {
    appVersion,
    codebaseVersion,
    deviceId,
    libVersion,
  } = useSelector(getClientInformation);

  if (!codebaseVersion) {
    return null;
  }

  return (
    <div
      className={cx('ui-shared__client-information', classes.root)}
      {...longPressAttrs}
      aria-hidden
    >
      <p className={classes.unselectable}>
        {`App Version: ${appVersion} (${codebaseVersion})`}
        <br />
        {`Lib Version: ${libVersion}`}
      </p>
      {deviceIdVisible &&
        <>
          <p className={classes.deviceId}>
            {`Device ID: ${deviceId ?? ''}`}
          </p>
          <DevelopmentSettings
            isOpen={developmentSettingsVisible}
            onClose={() => setDevelopmentSettingsVisible(false)}
          />
        </>
      }
    </div>
  );
};

export default ClientInformation;
