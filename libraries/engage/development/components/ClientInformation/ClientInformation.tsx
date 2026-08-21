import { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';
import { useLongPress } from '@shopgate/engage/core/hooks';
import { getClientInformation } from '@shopgate/engage/core/selectors';
import { pckVersion } from '@shopgate/pwa-common/helpers/config';
import DevelopmentSettings from '../DevelopmentSettings';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'relative',
    textAlign: 'center',
    color: theme.palette.text.secondary,
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
 * The client information the app reports about itself.
 */
interface ClientInformationState {
  appVersion: string;
  codebaseVersion: string;
  deviceId: string | null;
  libVersion: string;
}

/**
 * Renders the client information, and reveals the development settings on a long press.
 */
const ClientInformation = () => {
  const { classes, cx } = useStyles();
  const [deviceIdVisible, setDeviceIdVisible] = useState(false);
  const [developmentSettingsVisible, setDevelopmentSettingsVisible] = useState(false);

  // Press handler to show the device ID.
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
  } = useSelector(getClientInformation) as ClientInformationState;

  if (!codebaseVersion) {
    return null;
  }

  return (
    <Typography
      variant="caption"
      component="div"
      className={cx('ui-shared__client-information', classes.root)}
      {...longPressAttrs}
      aria-hidden
    >
      <p className={classes.unselectable}>
        {`App Version: ${appVersion} (${codebaseVersion})`}
        <br />
        {`Theme Version: ${pckVersion}`}
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
        </>}
    </Typography>
  );
};

export default ClientInformation;
