import { useSelector, useDispatch } from 'react-redux';
import type { UnknownAction } from 'redux';
import { SheetDrawer } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { getEnabledCMSVersion } from '@shopgate/engage/settings/selectors/merchantSettings';
import { getEnableCms2ForAllShoppers } from '@shopgate/engage/settings/selectors/shopSettings';
import { getIsCMS2PreviewEnabled, getIsColorSchemeSelectionEnabled, getIsDev } from '../../selectors';
import { toggleCms2Preview, toggleColorSchemeSelection } from '../../action-creators';

const useStyles = makeStyles()(theme => ({
  container: {
    padding: theme.spacing(2, 2, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  button: {
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export interface DevelopmentSettingsProps {
  /**
   * Whether the drawer is open.
   */
  isOpen: boolean;
  /**
   * The function to call when the drawer should be closed.
   */
  onClose: () => void;
}

/**
 * Development settings component.
 */
const DevelopmentSettings = ({
  isOpen,
  onClose,
}: DevelopmentSettingsProps) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const enabledCMSVersion = useSelector(getEnabledCMSVersion);
  const enableCms2ForAllShoppers = useSelector(getEnableCms2ForAllShoppers);
  const isCMS2PreviewEnabled = useSelector(getIsCMS2PreviewEnabled);
  const isDev = useSelector(getIsDev);
  const isColorSchemeSelectionEnabled = useSelector(getIsColorSchemeSelectionEnabled);

  // No need to show the preview toggle if CMS 2.0 is not available for the merchant or if it's
  // already enabled for all shoppers.
  const showCms2PreviewToggle = !enableCms2ForAllShoppers && enabledCMSVersion !== 'v1';

  if (!showCms2PreviewToggle && !isDev) {
    return null;
  }

  /**
   * Closes the drawer before dispatching, so the action does not re-render behind the closing
   * animation.
   * @param action The action to dispatch.
   */
  const closeAndDispatch = (action: UnknownAction) => {
    onClose();
    setTimeout(() => {
      dispatch(action);
    }, 300);
  };

  return (
    // @ts-expect-error - SheetDrawer is not typed yet
    <SheetDrawer
      title=" "
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={classes.container}>
        {showCms2PreviewToggle && (
          <Button
            className={classes.button}
            onClick={() => closeAndDispatch(toggleCms2Preview(!isCMS2PreviewEnabled))}
          >
            { `${isCMS2PreviewEnabled ? 'Disable' : 'Enable'} CMS 2.0 Preview`}
          </Button>
        )}
        {isDev && (
          <Button
            className={classes.button}
            onClick={() => closeAndDispatch(
              toggleColorSchemeSelection(!isColorSchemeSelectionEnabled)
            )}
          >
            { `${isColorSchemeSelectionEnabled ? 'Disable' : 'Enable'} Color Scheme Selection`}
          </Button>
        )}
      </div>
    </SheetDrawer>
  );
};

export default DevelopmentSettings;
