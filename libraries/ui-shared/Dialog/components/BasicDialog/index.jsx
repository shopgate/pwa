//TODO: Move to ThemeContext
import BaseDialogGMD from '@shopgate/pwa-ui-material/BaseDialog';
import BaseDialogIOS from '@shopgate/pwa-ui-ios/BaseDialog';
import { themeName } from '@shopgate/pwa-common/helpers/config';

const isIos = themeName.includes('ios');

export default isIos ? BaseDialogIOS : BaseDialogGMD;
