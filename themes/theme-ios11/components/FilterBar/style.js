import { css } from 'glamor';
import { themeShadows } from '@shopgate/pwa-common/helpers/config';

export default css({
  boxShadow: themeShadows.material,
  position: 'sticky',
  top: '-2px', // behind header shadow
  left: 0,
  zIndex: 10,
});
