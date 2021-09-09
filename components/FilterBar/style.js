import { css } from 'glamor';
import { themeShadows } from '@shopgate/pwa-common/helpers/config';

export default css({
  boxShadow: themeShadows.material,
  position: 'sticky',
  // todo: top has to be set dynamic depending on whether persistent-search-bar is installed or not
  top: '56px', // top: '-2px', // behind header shadow
  left: 0,
  zIndex: 1,
});
