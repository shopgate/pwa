import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const styles = {
  root: css({
    margin: '8px 8px 10px',
  }).toString(),
  rootNoFavoritesLists: css({
    background: colors.light,
    flexGrow: 1,
    paddingTop: variables.gap.xsmall,
    paddingLeft: '16px',
    paddingRight: '16px',
  }),
  title: css({
    flex: 1,
  }),
  divider: css({
    height: 1,
    width: 'calc(100% + 32px)',
    backgroundColor: 'rgb(234, 234, 234)',
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 16,
  }),
  loadMoreButton: css({
    width: 'calc(100% - 32px)',
    margin: '16px 16px 0 16px',
    borderRadius: 5,
  }).toString(),
};

export default styles;
