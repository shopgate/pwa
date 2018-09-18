import { cleanTabCmd } from './cleanTab';
import { popTabToRootCmd } from './popTabToRoot';
import showTab from './showTab';
import performCommandsAfterDelay from './performCommandsAfterDelay';
import { PWA_DEFAULT_TAB } from '../constants/Command';

/**
 * Send all commands that are needed to close the inAppBrowser.
 * @param {boolean} isAndroid True if we are on a android device.
 */
export default (isAndroid) => {
  const targetTab = {
    targetTab: 'in_app_browser',
  };

  const delayedCommand = (isAndroid
    ? cleanTabCmd(targetTab)
    : popTabToRootCmd(targetTab)
  ).buildCommand();

  performCommandsAfterDelay({
    cmds: [delayedCommand],
    delay: 0.4,
  });

  showTab({
    targetTab: PWA_DEFAULT_TAB,
    transition: 'slideOutToBottom',
  });
};
