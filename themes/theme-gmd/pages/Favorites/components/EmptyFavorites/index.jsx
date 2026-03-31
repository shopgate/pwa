import React, { useMemo } from 'react';
import { I18n } from '@shopgate/engage/components';
import { FAVORITES_EMPTY } from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { svgToDataUrl } from '@shopgate/engage/core/helpers';
import { useScrollContainer } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import Icon from './components/Icon';
import ContinueButton from './components/ContinueButton';

const { svgImages = {}, variables } = themeConfig || {};
const { emptyFavorites = '' } = svgImages || {};

const useStyles = makeStyles()(theme => ({
  container: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingBottom: variables.emptyPage.buttonVerticalGap,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerWithTopPadding: {
    paddingTop: 100,
  },
  iconContainer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    paddingTop: variables.emptyPage.titleTopGap,
  },
}));

/**
 * The Empty Favorites component
 * @return {JSX.Element}
 */
const EmptyFavorites = () => {
  const { classes, cx } = useStyles();
  const hasScrollContainer = useScrollContainer();
  const imageSRC = useMemo(() => svgToDataUrl(emptyFavorites), []);

  return (
    <div
      className={cx(classes.container, {
        [classes.containerWithTopPadding]: !hasScrollContainer,
      })}
    >
      <SurroundPortals portalName={FAVORITES_EMPTY}>
        <div
          className={cx(classes.iconContainer, 'empty-favorites__image')}
          data-test-id="emptyFavComponent"
        >
          {emptyFavorites
            ? <img src={imageSRC} alt="" />
            : <Icon />}
          <I18n.Text string="favorites.empty" className={classes.title} />
        </div>
        <ContinueButton />
      </SurroundPortals>
    </div>
  );
};

export default EmptyFavorites;
